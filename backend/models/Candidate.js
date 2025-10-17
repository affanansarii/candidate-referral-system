const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Hired'],
        default: 'Pending'
    },
    resumeUrl: {
        type: String,
        default: null
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now
    }
}, {
    timestamps: true
});

// Index for search functionality
candidateSchema.index({ name: 'text', jobTitle: 'text', status: 'text' });

module.exports = mongoose.model('Candidate', candidateSchema);