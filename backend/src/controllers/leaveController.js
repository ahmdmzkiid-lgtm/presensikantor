const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createLeaveRequest = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;
  const userId = req.user.id;
  const attachment = req.file ? req.file.path : null;

  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  try {
    // 1. Get Leave Limit from Office Settings
    const office = await prisma.office.findFirst();
    const maxLeave = office?.maxLeavePerMonth || 3;

    // 2. Count user's leave days for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const existingRequests = await prisma.leaveRequest.findMany({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
        status: { in: ['APPROVED', 'PENDING'] }
      }
    });

    const usedDays = existingRequests.reduce((total, req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diff = Math.abs(end - start);
      return total + Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    }, 0);

    // 3. Calculate requested days
    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);
    const reqDiff = Math.abs(reqEnd - reqStart);
    const requestedDays = Math.ceil(reqDiff / (1000 * 60 * 60 * 24)) + 1;

    if (usedDays + requestedDays > maxLeave) {
      return res.status(400).json({ 
        message: `Batas pengajuan izin bulan ini telah tercapai. Sisa kuota Anda: ${maxLeave - usedDays} hari.` 
      });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        attachment
      }
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLeaveRequests = async (req, res) => {
  try {
    const requests = await prisma.leaveRequest.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid' });
  }

  if (status === 'REJECTED' && !adminNotes) {
    return res.status(400).json({ message: 'Alasan penolakan wajib diisi' });
  }

  try {
    const request = await prisma.leaveRequest.update({
      where: { id },
      data: { status, adminNotes }
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveStatus
};
