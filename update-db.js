/**
 * Update Database Schema Script
 * Applies the updated Prisma schema to the database
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===== Updating Database Schema =====');

try {
  // Generate Prisma client with the updated schema
  console.log('\n1. Generating Prisma client...');
  execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  
  // Apply database migrations
  console.log('\n2. Applying schema changes to database...');
  execSync('npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss', { stdio: 'inherit' });
  
  console.log('\n✅ Database schema updated successfully!');
  console.log('You can now run the application with: npm run start:robust');
} catch (error) {
  console.error('\n❌ Failed to update database schema:', error.message);
  process.exit(1);
}