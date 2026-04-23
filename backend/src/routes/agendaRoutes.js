const express = require('express');
const { getAgendas, createAgenda, updateAgenda, deleteAgenda } = require('../controllers/agendaController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAgendas);
router.post('/', authMiddleware, adminMiddleware, createAgenda);
router.patch('/:id', authMiddleware, adminMiddleware, updateAgenda);
router.delete('/:id', authMiddleware, adminMiddleware, deleteAgenda);

module.exports = router;
