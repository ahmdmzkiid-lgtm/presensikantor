const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOfficeSettings = async (req, res) => {
  try {
    const office = await prisma.office.findFirst();
    res.json(office);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOfficeSettings = async (req, res) => {
  const { name, address, latitude, longitude, radius, maxLeavePerMonth } = req.body;

  try {
    const office = await prisma.office.findFirst();
    if (!office) {
      return res.status(404).json({ message: 'Pengaturan kantor tidak ditemukan' });
    }

    const updatedOffice = await prisma.office.update({
      where: { id: office.id },
      data: {
        name: name || office.name,
        address: address || office.address,
        latitude: latitude !== undefined ? parseFloat(latitude) : office.latitude,
        longitude: longitude !== undefined ? parseFloat(longitude) : office.longitude,
        radius: radius !== undefined ? parseInt(radius) : office.radius,
        maxLeavePerMonth: maxLeavePerMonth !== undefined ? parseInt(maxLeavePerMonth) : office.maxLeavePerMonth
      }
    });

    res.json(updatedOffice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDivisions = async (req, res) => {
  try {
    const divisions = await prisma.division.findMany({ orderBy: { name: 'asc' } });
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkSchedules = async (req, res) => {
  try {
    const schedules = await prisma.workSchedule.findMany({ orderBy: { name: 'asc' } });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOfficeSettings,
  updateOfficeSettings,
  getDivisions,
  getWorkSchedules
};
