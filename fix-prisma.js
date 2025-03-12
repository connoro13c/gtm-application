/**
 * Prisma Fix Script
 * A standalone script that forcibly configures Prisma correctly
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete and recreate the Prisma client directories to force a clean generation
function cleanPrismaDirectories() {
  const dirs = [
    path.join(__dirname, 'node_modules', '.prisma'),
    path.join(__dirname, 'node_modules', '@prisma', 'client'),
    path.join(__dirname, 'backend', 'node_modules', '.prisma'),
    path.join(__dirname, 'backend', 'node_modules', '@prisma', 'client')
  ];
  
  console.log('Cleaning Prisma directories...');
  
  dirs.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        console.log(`Removing ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch (err) {
      console.error(`Failed to remove ${dir}: ${err.message}`);
    }
  });
}

// Create a basic backend/prisma.js file that doesn't try to regenerate Prisma
function createSimplePrismaHelper() {
  const content = `/**
 * Simple Prisma Client initialization
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
`;

  const prismaJsPath = path.join(__dirname, 'backend', 'src', 'prisma.js');
  console.log(`Creating simple prisma.js at ${prismaJsPath}`);
  fs.writeFileSync(prismaJsPath, content);
}

// Install Prisma dependencies fresh
function reinstallPrismaDependencies() {
  console.log('Reinstalling Prisma dependencies in root and backend...');
  
  try {
    execSync('npm uninstall prisma @prisma/client', { stdio: 'inherit' });
    execSync('npm install prisma@6.4.1 @prisma/client@6.4.1', { stdio: 'inherit' });
    
    if (fs.existsSync(path.join(__dirname, 'backend', 'package.json'))) {
      execSync('cd backend && npm uninstall prisma @prisma/client', { stdio: 'inherit' });
      execSync('cd backend && npm install prisma@6.4.1 @prisma/client@6.4.1', { stdio: 'inherit' });
    }
  } catch (err) {
    console.error(`Failed to reinstall dependencies: ${err.message}`);
  }
}

// Create direct database connection modules as an alternative to Prisma
function createDirectDbConnection() {
  const pgContent = `/**
 * Direct PostgreSQL connection
 * An alternative to Prisma for basic database operations
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};
`;

  const dbDirPath = path.join(__dirname, 'backend', 'src', 'db');
  if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true });
  }
  
  const pgPath = path.join(dbDirPath, 'pg.js');
  console.log(`Creating direct PostgreSQL connection at ${pgPath}`);
  fs.writeFileSync(pgPath, pgContent);
  
  // Also install pg package
  try {
    execSync('cd backend && npm install pg@8.13.3', { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to install pg package: ${err.message}`);
  }
}

// Generate Prisma client in a clean way
function generatePrismaClient() {
  console.log('Generating Prisma client with explicit paths...');
  
  try {
    // Generate in root
    execSync(`npx prisma generate --schema=${path.join(__dirname, 'prisma', 'schema.prisma')}`, { stdio: 'inherit' });
    
    // Generate in backend using an absolute path to the schema
    execSync(`cd backend && npx prisma generate --schema=${path.join(__dirname, 'prisma', 'schema.prisma')}`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Failed to generate Prisma client: ${err.message}`);
  }
}

// Make sure environment variables are consistent
function setupEnvironmentVariables() {
  console.log('Setting up environment variables...');
  
  const envContent = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gtm_app?schema=public"\nPORT=5000\nNODE_ENV=development';
  
  // Write to root .env
  fs.writeFileSync(
    path.join(__dirname, '.env'),
    envContent
  );
  
  // Write to backend .env
  fs.writeFileSync(
    path.join(__dirname, 'backend', '.env'),
    envContent
  );
}

// Create a simple test script
function createTestScript() {
  const content = `/**
 * Test database connection
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection with Prisma...');
    const result = await prisma.$queryRaw\`SELECT 1 as test\`;
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
`;

  const testPath = path.join(__dirname, 'test-prisma.js');
  console.log(`Creating test script at ${testPath}`);
  fs.writeFileSync(testPath, content);
}

// Main function to run all fixes
async function main() {
  console.log('===== PRISMA FIXING SCRIPT =====');
  
  // Execute all steps
  cleanPrismaDirectories();
  reinstallPrismaDependencies();
  setupEnvironmentVariables();
  createSimplePrismaHelper();
  createDirectDbConnection(); // Alternative DB connection
  generatePrismaClient();
  createTestScript();
  
  console.log('\n===== FIX COMPLETED =====');
  console.log('You can now test Prisma with: node test-prisma.js');
  console.log('If successful, run: npm run start');
  console.log('If it fails, try using the direct pg.js connection instead of Prisma');
}

main().catch(err => {
  console.error('Fix script failed:', err);
  process.exit(1);
});