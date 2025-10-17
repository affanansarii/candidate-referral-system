const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + '.pdf');
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Validation rules
const candidateValidation = [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').matches(/^\+?[\d\s\-\(\)]{10,}$/).withMessage('Valid phone number is required'),
    body('jobTitle').notEmpty().withMessage('Job title is required').trim()
];

// GET /api/candidates - Get all candidates with optional search
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        const candidates = await Candidate.find(query).sort({ createdAt: -1 });
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// POST /api/candidates - Create new candidate
router.post('/', upload.single('resume'), candidateValidation, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there's a file uploaded but validation failed, remove it
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, jobTitle } = req.body;

        // Check if candidate with email already exists
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            // If there's a file uploaded but candidate exists, remove it
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ error: 'Candidate with this email already exists' });
        }

        const candidateData = {
            name,
            email,
            phone,
            jobTitle,
            resumeUrl: req.file ? `/uploads/${req.file.filename}` : null
        };

        console.log('Creating candidate with data:', candidateData);

        const candidate = new Candidate(candidateData);
        await candidate.save();

        res.status(201).json(candidate);
    } catch (error) {
        console.error('Error creating candidate:', error);

        // If there's a file uploaded but error occurred, remove it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'Server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// PUT /api/candidates/:id/status - Update candidate status
router.put('/:id/status', [
    body('status').isIn(['Pending', 'Reviewed', 'Hired']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.json(candidate);
    } catch (error) {
        console.error('Error updating candidate status:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Delete resume file if exists
        if (candidate.resumeUrl) {
            const filePath = path.join(__dirname, '..', candidate.resumeUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Candidate.findByIdAndDelete(req.params.id);

        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// GET /api/candidates/stats - Get candidate statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Candidate.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Candidate.countDocuments();

        const statsObj = {
            total,
            byStatus: stats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, { Pending: 0, Reviewed: 0, Hired: 0 })
        };

        res.json(statsObj);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

module.exports = router;