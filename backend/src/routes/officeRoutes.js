const express = require('express');
const { getOfficeSettings, updateOfficeSettings, getDivisions, getWorkSchedules } = require('../controllers/officeController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getOfficeSettings);
router.patch('/', authMiddleware, adminMiddleware, updateOfficeSettings);
router.get('/divisions', authMiddleware, getDivisions);
router.get('/schedules', authMiddleware, getWorkSchedules);

module.exports = router;
