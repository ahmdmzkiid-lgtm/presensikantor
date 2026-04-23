const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAgendas = async (req, res) => {
  try {
    const agendas = await prisma.agenda.findMany({
      orderBy: { date: 'asc' },
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)) // Only future or today's agendas
        }
      }
    });
    res.json(agendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAgenda = async (req, res) => {
  const { title, description, date, startTime, endTime, location } = req.body;
  try {
    const agenda = await prisma.agenda.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location
      }
    });
    res.status(201).json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAgenda = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, startTime, endTime, location } = req.body;
  try {
    const agenda = await prisma.agenda.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location
      }
    });
    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAgenda = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.agenda.delete({ where: { id } });
    res.json({ message: 'Agenda deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAgendas,
  createAgenda,
  updateAgenda,
  deleteAgenda
};
