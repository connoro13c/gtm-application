/**
 * Fix Prisma in Backend
 * Aggressively sets up Prisma in the backend folder
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===== FIXING BACKEND PRISMA =====');

// 1. Clean out any existing Prisma files in backend
console.log('Step 1: Cleaning existing Prisma files...');
const backendPrismaDir = path.join(__dirname, 'backend', 'node_modules', '.prisma');
if (fs.existsSync(backendPrismaDir)) {
  console.log(`Removing ${backendPrismaDir}`);
  fs.rmSync(backendPrismaDir, { recursive: true, force: true });
}

const backendClientDir = path.join(__dirname, 'backend', 'node_modules', '@prisma', 'client');
if (fs.existsSync(backendClientDir)) {
  console.log(`Removing ${backendClientDir}`);
  fs.rmSync(backendClientDir, { recursive: true, force: true });
}

// 2. Make sure necessary directories exist
console.log('\nStep 2: Creating backend directories...');
const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
if (!fs.existsSync(backendNodeModules)) {
  console.log(`Creating ${backendNodeModules}`);
  fs.mkdirSync(backendNodeModules, { recursive: true });
}

const backendSrcDir = path.join(__dirname, 'backend', 'src');
if (!fs.existsSync(backendSrcDir)) {
  console.log(`Creating ${backendSrcDir}`);
  fs.mkdirSync(backendSrcDir, { recursive: true });
}

// 3. Install Prisma in backend directory
console.log('\nStep 3: Installing Prisma in backend...');
try {
  execSync('cd backend && npm install --save @prisma/client@6.4.1', { stdio: 'inherit' });
  execSync('cd backend && npm install --save-dev prisma@6.4.1', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install Prisma:', error.message);
}

// 4. Copy schema.prisma to backend directory for easier access
console.log('\nStep 4: Copying schema.prisma to backend...');
const schemaSource = path.join(__dirname, 'prisma', 'schema.prisma');
const schemaBackendDest = path.join(__dirname, 'backend', 'prisma');

if (!fs.existsSync(schemaBackendDest)) {
  fs.mkdirSync(schemaBackendDest, { recursive: true });
}

fs.copyFileSync(
  schemaSource, 
  path.join(schemaBackendDest, 'schema.prisma')
);

// 5. Generate Prisma client specifically in backend
console.log('\nStep 5: Generating Prisma client in backend...');
try {
  execSync('cd backend && npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
}

// 6. Create a very simple prisma.js file
console.log('\nStep 6: Creating simple prisma.js file...');
const prismaJsContent = `/**
 * Simplified Prisma Client initialization
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
`;

fs.writeFileSync(
  path.join(__dirname, 'backend', 'src', 'prisma.js'),
  prismaJsContent
);

// 7. Create a test.js file in backend to verify it works
console.log('\nStep 7: Creating test file...');
const testJsContent = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testConnection = async () => {
  try {
    const result = await prisma.$queryRaw\`SELECT 1 as test\`;
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
`;

fs.writeFileSync(
  path.join(__dirname, 'backend', 'test.js'),
  testJsContent
);

console.log('\n===== BACKEND PRISMA FIX COMPLETED =====');
console.log('Next steps:');
console.log('1. Test backend Prisma with: cd backend && node test.js');
console.log('2. If the test works, start the application: npm run start:robust');
console.log('3. If it fails, check PostgreSQL access and permissions');