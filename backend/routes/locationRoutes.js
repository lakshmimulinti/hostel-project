// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const { getCities } = require('../controllers/locationController');

router.get('/cities', getCities);

module.exports = router;