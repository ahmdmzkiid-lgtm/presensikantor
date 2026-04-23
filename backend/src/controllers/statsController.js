const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get Office Settings (for leave limit)
    const office = await prisma.office.findFirst();
    const maxLeave = office?.maxLeavePerMonth || 0;

    // 2. Count current month's leave requests (Approved or Pending)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
        status: { in: ['APPROVED', 'PENDING'] }
      }
    });

    const usedLeaveDays = leaveRequests.reduce((total, req) => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return total + diffDays;
    }, 0);

    // 3. Get today's attendance status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    res.json({
      maxLeave,
      usedLeave: usedLeaveDays,
      remainingLeave: Math.max(0, maxLeave - usedLeaveDays),
      todayAttendance: !!todayAttendance,
      checkInTime: todayAttendance?.checkIn || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployeePerformance = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
      include: {
        division: true,
        attendances: true,
        overtimeRequests: { where: { status: 'APPROVED' } },
        leaveRequests: { where: { status: 'APPROVED' } }
      }
    });

    const performanceData = users.map(user => {
      const totalAttendance = user.attendances.length;
      const totalOvertimeHours = user.overtimeRequests.reduce((sum, req) => sum + req.duration, 0);
      const totalLeaveDays = user.leaveRequests
        .filter(req => req.type === 'LEAVE' || req.type === 'PERMISSION')
        .reduce((sum, req) => {
          const diff = Math.ceil(Math.abs(new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1;
          return sum + diff;
        }, 0);
      const totalSickDays = user.leaveRequests
        .filter(req => req.type === 'SICK')
        .reduce((sum, req) => {
          const diff = Math.ceil(Math.abs(new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1;
          return sum + diff;
        }, 0);

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        division: user.division?.name || '-',
        totalAttendance,
        totalOvertimeHours,
        totalLeaveDays,
        totalSickDays
      };
    });

    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDailyAttendanceStatus = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allUsers = await prisma.user.findMany({
      where: { role: { in: ['EMPLOYEE', 'ADMIN'] } },
      include: { division: true }
    });

    const todayAttendances = await prisma.attendance.findMany({
      where: {
        createdAt: { gte: today }
      },
      include: { user: true }
    });

    const todayLeaves = await prisma.leaveRequest.findMany({
      where: {
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today }
      }
    });

    const presentUserIds = todayAttendances.map(a => a.userId);
    
    const present = todayAttendances.map(a => ({
      id: a.id,
      userId: a.userId,
      name: a.user.name,
      email: a.user.email,
      checkIn: a.checkIn,
      photo: a.photoCheckIn,
      division: allUsers.find(u => u.id === a.userId)?.division?.name || '-',
      role: a.user.role,
      lat: a.latCheckIn,
      long: a.longCheckIn
    }));

    const absent = allUsers
      .filter(user => !presentUserIds.includes(user.id))
      .map(user => {
        const leave = todayLeaves.find(l => l.userId === user.id);
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          division: user.division?.name || '-',
          role: user.role,
          status: leave ? (leave.type === 'SICK' ? 'Sakit' : 'Izin') : 'Alpa'
        };
      });

    res.json({ present, absent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserStats, getEmployeePerformance, getDailyAttendanceStatus };
