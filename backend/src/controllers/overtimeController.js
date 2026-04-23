const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOvertime = async (req, res) => {
  const { date, startTime, endTime, reason } = req.body;

  try {
    // Calculate duration in hours
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const diffMs = end - start;
    const duration = Math.round(diffMs / (1000 * 60 * 60));

    if (duration <= 0) {
      return res.status(400).json({ message: 'Waktu selesai harus setelah waktu mulai' });
    }

    const overtime = await prisma.overtimeRequest.create({
      data: {
        userId: req.user.id,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        reason,
        status: 'PENDING'
      }
    });
    res.status(201).json(overtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyOvertime = async (req, res) => {
  try {
    const overtime = await prisma.overtimeRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOvertime = async (req, res) => {
  try {
    const overtime = await prisma.overtimeRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true, division: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOvertimeStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid' });
  }

  if (status === 'REJECTED' && !adminNotes) {
    return res.status(400).json({ message: 'Alasan penolakan wajib diisi' });
  }

  try {
    const overtime = await prisma.overtimeRequest.update({
      where: { id },
      data: { status, adminNotes }
    });
    res.json(overtime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOvertime, getMyOvertime, getAllOvertime, updateOvertimeStatus };
