const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const candidateRoutes = require('./routes/candidate');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware - CORS first
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - make sure uploads directory exists
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://affanansarii:affanansarii7860@cluster0.xcw2ywx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});