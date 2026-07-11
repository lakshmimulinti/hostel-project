const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/register-password', authController.registerWithPassword);
router.post('/login-password', authController.loginWithPassword);
router.get('/diagnostic', authController.diagnostic);

module.exports = router;