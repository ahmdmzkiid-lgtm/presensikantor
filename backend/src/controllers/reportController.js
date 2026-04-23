const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createReport = async (req, res) => {
  const { content, date } = req.body;
  const attachment = req.file ? req.file.filename : null;

  try {
    const report = await prisma.dailyReport.create({
      data: {
        userId: req.user.id,
        content,
        date: date ? new Date(date) : new Date(),
        attachment
      }
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await prisma.dailyReport.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.dailyReport.findMany({
      include: {
        user: {
          select: { name: true, email: true, division: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createReport, getMyReports, getAllReports };
