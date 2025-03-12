/**
 * Database Setup Script
 * Initializes PostgreSQL database for GTM Application
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

console.log(`${colors.bright}${colors.blue}===== GTM Application Database Setup =====${colors.reset}\n`);

// Step 1: Check PostgreSQL connection
console.log(`${colors.bright}${colors.green}[1/4] Checking PostgreSQL connection...${colors.reset}`);
try {
  execSync('pg_isready', { stdio: 'inherit' });
  console.log(`${colors.green}✓ PostgreSQL server is running${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ PostgreSQL server is not running${colors.reset}`);
  console.error(`${colors.red}Please start PostgreSQL and try again${colors.reset}`);
  process.exit(1);
}

// Step 2: Create database if it doesn't exist
console.log(`${colors.bright}${colors.green}[2/4] Creating database if needed...${colors.reset}`);
try {
  // Create database if not exists (command varies by platform)
  const dbName = 'gtm_app';
  
  try {
    execSync(`psql -c "SELECT 1 FROM pg_database WHERE datname = '${dbName}'" | grep -q 1 || psql -c "CREATE DATABASE ${dbName}"`, { stdio: 'ignore' });
    console.log(`${colors.green}✓ Database '${dbName}' exists or was created${colors.reset}\n`);
  } catch (err) {
    // Try a different approach if the first one fails
    console.log(`${colors.yellow}⚠ Could not check/create database with psql directly. Trying alternative approach...${colors.reset}`);
    execSync(`createdb ${dbName} || echo "Database may already exist"`, { stdio: 'inherit' });
    console.log(`${colors.green}✓ Database creation attempted${colors.reset}\n`);
  }
} catch (error) {
  console.warn(`${colors.yellow}⚠ Could not automatically create database${colors.reset}`);
  console.warn(`${colors.yellow}You may need to create the 'gtm_app' database manually${colors.reset}\n`);
}

// Step 3: Apply Prisma schema
console.log(`${colors.bright}${colors.green}[3/4] Applying database schema...${colors.reset}`);
try {
  // Generate Prisma client first to ensure it's available
  execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  
  // Push schema to database
  execSync('npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Database schema applied successfully${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to apply database schema${colors.reset}`);
  console.error(error.message);
  process.exit(1);
}

// Step 4: Seed the database
console.log(`${colors.bright}${colors.green}[4/4] Seeding database with initial data...${colors.reset}`);
try {
  execSync('node ./prisma/seed.js', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Database seeded successfully${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to seed database${colors.reset}`);
  console.error(error.message);
  // Don't exit, seeding is not critical
}

console.log(`${colors.bright}${colors.green}✓ Database setup complete!${colors.reset}`);
console.log(`${colors.bright}${colors.blue}You can now start the application with: npm run start${colors.reset}\n`);