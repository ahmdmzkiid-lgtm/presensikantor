const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
  createLeaveRequest, 
  getMyLeaveRequests, 
  getAllLeaveRequests, 
  updateLeaveStatus 
} = require('../controllers/leaveController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer for attachments (optional for sick leave)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'leave-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Employee routes
router.post('/', authMiddleware, upload.single('attachment'), createLeaveRequest);
router.get('/my', authMiddleware, getMyLeaveRequests);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, getAllLeaveRequests);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateLeaveStatus);

module.exports = router;
