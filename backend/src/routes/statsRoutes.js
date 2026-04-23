const express = require('express');
const { getUserStats, getEmployeePerformance, getDailyAttendanceStatus } = require('../controllers/statsController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getUserStats);
router.get('/performance', authMiddleware, adminMiddleware, getEmployeePerformance);
router.get('/daily-status', authMiddleware, adminMiddleware, getDailyAttendanceStatus);

module.exports = router;
