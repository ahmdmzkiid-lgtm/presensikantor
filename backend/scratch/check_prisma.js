const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('DailyReport model exists:', !!prisma.dailyReport);
process.exit(0);
