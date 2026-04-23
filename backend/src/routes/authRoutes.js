const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register); // Normally restricted, but keeping open for initial setup

// Protected routes
router.get('/me', authMiddleware, getMe);

module.exports = router;
