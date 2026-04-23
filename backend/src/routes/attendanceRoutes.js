const express = require('express');
const multer = require('multer');
const path = require('path');
const { checkIn, checkOut, getHistory, getAllAttendances } = require('../controllers/attendanceController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer for storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Employee routes
router.post('/check-in', authMiddleware, upload.single('photo'), checkIn);
router.post('/check-out', authMiddleware, upload.single('photo'), checkOut);
router.get('/history', authMiddleware, getHistory);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllAttendances);

module.exports = router;
