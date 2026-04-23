const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { calculateDistance } = require('../utils/distance');
const path = require('path');
const fs = require('fs');

const checkIn = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.id;
  const photo = req.file ? req.file.path : null;

  if (!latitude || !longitude || !photo) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Lokasi dan foto wajib diisi' });
  }

  try {
    // 1. Get Office data (assuming one office for now)
    const office = await prisma.office.findFirst();
    if (!office) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ 
        message: 'Data lokasi kantor belum dikonfigurasi oleh Admin. Silakan hubungi admin.' 
      });
    }

    // 2. Validate distance
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      office.latitude,
      office.longitude
    );

    if (distance > office.radius) {
      // Delete uploaded file if outside radius
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: `Anda berada di luar radius kantor (${Math.round(distance)}m). Batas maksimal adalah ${office.radius}m.` 
      });
    }

    // 3. Create attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        createdAt: { gte: today }
      }
    });

    if (existingAttendance) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Anda sudah melakukan absen masuk hari ini' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        checkIn: new Date(),
        latCheckIn: parseFloat(latitude),
        longCheckIn: parseFloat(longitude),
        photoCheckIn: photo,
        status: 'PRESENT'
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

const checkOut = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.user.id;
  const photo = req.file ? req.file.path : null;

  if (!latitude || !longitude || !photo) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Lokasi dan foto wajib diisi untuk absen pulang' });
  }

  try {
    const office = await prisma.office.findFirst();
    if (!office) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: 'Data lokasi kantor tidak ditemukan' });
    }

    // Validate distance for check-out as well
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      office.latitude,
      office.longitude
    );

    if (distance > office.radius) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: `Gagal absen pulang. Anda di luar radius kantor (${Math.round(distance)}m).` 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        createdAt: { gte: today },
        checkOut: null
      }
    });

    if (!attendance) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Tidak ada data absen masuk hari ini yang belum ditutup' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: new Date(),
        latCheckOut: parseFloat(latitude),
        longCheckOut: parseFloat(longitude),
        photoCheckOut: photo
      }
    });

    res.json(updatedAttendance);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await prisma.attendance.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllAttendances = async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { checkIn, checkOut, getHistory, getAllAttendances };
