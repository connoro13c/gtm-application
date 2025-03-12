/**
 * Backend Initialization Script
 * Sets up backend environment and generates Prisma client
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===== Backend Initialization =====');

// Ensure backend/.env exists
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating backend/.env file...');
  fs.copyFileSync(
    path.join(__dirname, '.env'),
    envPath
  );
}

// Install dependencies
console.log('Installing backend dependencies...');
execSync('cd backend && npm install', { stdio: 'inherit' });

// Generate Prisma client specifically for the backend
console.log('Generating Prisma client for backend...');
execSync('cd backend && npx prisma generate --schema=../prisma/schema.prisma', { stdio: 'inherit' });

console.log('\n\u2705 Backend initialization complete!\n');
console.log('You can now run the application with: npm start');