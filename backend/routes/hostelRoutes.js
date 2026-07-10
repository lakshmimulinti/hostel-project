const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

// Route to fetch hostels by city query parameter
router.get('/', hostelController.getHostelsByCity);

// Route to handle hostel booking submissions
router.post('/book', hostelController.createBooking);

module.exports = router;
