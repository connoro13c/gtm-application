/**
 * Test database connection
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection with Prisma...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Connection successful:', result);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('✅ Prisma setup is working correctly!');
      process.exit(0);
    } else {
      console.error('❌ Prisma setup failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
