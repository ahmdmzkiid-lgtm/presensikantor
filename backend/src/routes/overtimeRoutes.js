const express = require('express');
const router = express.Router();
const overtimeController = require('../controllers/overtimeController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', overtimeController.createOvertime);
router.get('/my', overtimeController.getMyOvertime);
router.get('/all', adminMiddleware, overtimeController.getAllOvertime);
router.patch('/:id/status', adminMiddleware, overtimeController.updateOvertimeStatus);

module.exports = router;
