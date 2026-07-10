const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const hostelRoutes = require('./routes/hostelRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/hostels', hostelRoutes);

// Root route check
app.get('/', (req, res) => {
    res.send('HostelHub Backend API is Running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running perfectly on port ${PORT}`);
});