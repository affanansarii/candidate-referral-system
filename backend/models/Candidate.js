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
        required: true
    }
}, {
    timestamps: true
});

// Index for user-specific queries
candidateSchema.index({ referredBy: 1, name: 'text', jobTitle: 'text', status: 'text' });

// Compound index for user-specific email uniqueness
candidateSchema.index({ email: 1, referredBy: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', candidateSchema);