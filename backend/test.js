import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testConnection = async () => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Success:', result);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

testConnection().then(success => {
  console.log('Test completed with result:', success);
  process.exit(success ? 0 : 1);
});
