const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('zaki1212', 10);
  
  const superadmin = await prisma.user.upsert({
    where: { email: 'admin@absensi.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@absensi.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPERADMIN',
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'karyawan@absensi.com' },
    update: { password: hashedPassword },
    create: {
      email: 'karyawan@absensi.com',
      password: hashedPassword, // same password 'admin123' for testing
      name: 'Budi Karyawan',
      role: 'EMPLOYEE',
    },
  });

  const mainOffice = await prisma.office.upsert({
    where: { id: 'main-office' },
    update: {
      latitude: -6.366467,
      longitude: 106.777708,
      radius: 500,
    },
    create: {
      id: 'main-office',
      name: 'Kantor Pusat',
      address: 'Jl. Contoh No. 123',
      latitude: -6.366467,
      longitude: 106.777708,
      radius: 500,
    },
  });

  const divisions = [
    'Finance & Acounting',
    'Marketing Sales',
    'Produksi',
    'IT Support',
    'Humas',
    'Purchasing',
    'HR'
  ];

  for (const divName of divisions) {
    await prisma.division.upsert({
      where: { name: divName },
      update: {},
      create: { name: divName }
    });
  }

  // Also add a default schedule if none exists
  const existingSchedule = await prisma.workSchedule.findFirst({
    where: { name: 'Regular Shift' }
  });
  
  if (!existingSchedule) {
    await prisma.workSchedule.create({
      data: {
        name: 'Regular Shift',
        startTime: '08:00',
        endTime: '17:00'
      }
    });
  }

  console.log('Seed completed successfully');

  console.log({ superadmin, employee, mainOffice });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
