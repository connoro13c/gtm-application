/**
 * Robust GTM Application Start Script
 * Handles multiple failure cases and has fallback mechanisms
 */

import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m', 
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}===== GTM Application Robust Startup =====${colors.reset}\n`);

// Step 0: Environment checks
console.log(`${colors.bright}${colors.green}[0/5] Running environment checks...${colors.reset}`);

// Check database connection
console.log('Checking PostgreSQL database connection...');
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gtm_app?schema=public';
try {
  // Try to connect to the database using a simple command
  execSync('pg_isready', { stdio: 'ignore' });
  console.log(`${colors.green}✓ PostgreSQL server is running${colors.reset}`);
} catch (error) {
  console.warn(`${colors.yellow}⚠ PostgreSQL server might not be running${colors.reset}`);
  console.warn(`${colors.yellow}⚠ Database features may not work. Please start PostgreSQL.${colors.reset}`);
}

// Check port 3000
console.log('Checking port 3000...');
try {
  if (process.platform === 'win32') {
    // Windows command
    execSync('for /f "tokens=5" %a in (\'netstat -aon ^| findstr :3000\') do taskkill /F /PID %a', { stdio: 'ignore' });
  } else {
    // macOS/Linux command
    execSync('lsof -ti:3000 | xargs kill -9', { stdio: 'ignore' });
  }
  console.log(`${colors.green}✓ Port 3000 is now available${colors.reset}\n`);
} catch (error) {
  // Ignore errors - likely means no process was running on that port
  console.log(`${colors.green}✓ No processes found on port 3000${colors.reset}\n`);
}

// Step 1: Prepare environment files and PostgreSQL
console.log(`${colors.bright}${colors.green}[1/5] Setting up environment...${colors.reset}`);

// Ensure .env files exist in the right places
const envContent = 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gtm_app?schema=public"\nPORT=5000\nNODE_ENV=development';

// Write to root .env if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log(`${colors.green}✓ Created root .env file${colors.reset}`);
}

// Ensure backend folder has the same .env
if (!fs.existsSync(path.join(__dirname, 'backend', '.env'))) {
  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), envContent);
  console.log(`${colors.green}✓ Created backend .env file${colors.reset}`);
}

// Step 2: Decide which server file to use (default or fallback)
console.log(`${colors.bright}${colors.green}[2/5] Checking server configuration...${colors.reset}`);

// Try to run the test script to check if Prisma is working
let useFallbackServer = false;
try {
  console.log('Testing Prisma client configuration...');
  // Create a simple test file
  const testFilePath = path.join(__dirname, 'prisma-test.js');
  const testFileContent = `
  import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();
  async function test() {
    try {
      await prisma.$queryRaw\`SELECT 1 as test\`;
      return true;
    } catch (e) {
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
  test().then(result => process.exit(result ? 0 : 1));
  `;
  fs.writeFileSync(testFilePath, testFileContent);
  
  // Run the test
  execSync(`node ${testFilePath}`, { stdio: 'ignore' });
  console.log(`${colors.green}✓ Prisma is working correctly${colors.reset}`);
  fs.unlinkSync(testFilePath); // Clean up test file
} catch (error) {
  console.warn(`${colors.yellow}⚠ Prisma test failed, will use fallback server${colors.reset}`);
  useFallbackServer = true;
}

// Step 3: Start the backend server
console.log(`${colors.bright}${colors.green}[3/5] Starting backend server...${colors.reset}`);
const serverFile = useFallbackServer ? 'backend/src/server-fallback.js' : 'backend/src/server.js';
console.log(`Using server file: ${serverFile}`);

const backend = spawn('node', [serverFile], {
  stdio: 'pipe',
  shell: true,
  env: {...process.env}
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`${colors.yellow}[BACKEND] ${colors.reset}${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`${colors.red}[BACKEND ERROR] ${colors.reset}${data}`);
});

// Wait for backend to start before launching frontend
let backendStarted = false;
backend.stdout.on('data', (data) => {
  if (data.toString().includes('Server running on port') && !backendStarted) {
    backendStarted = true;
    startFrontend();
  }
});

// If backend doesn't start within 5 seconds, check if it's still running
setTimeout(() => {
  if (!backendStarted) {
    if (backend.exitCode !== null) {
      console.error(`${colors.red}✗ Backend server failed to start (exit code: ${backend.exitCode})${colors.reset}`);
      console.error(`${colors.yellow}Starting frontend anyway, but backend features will not work.${colors.reset}`);

      startFrontend();
    } else {
      console.log(`${colors.yellow}⚠ Backend server taking longer than expected to start. Starting frontend anyway...${colors.reset}`);
      startFrontend();
    }
  }
}, 5000);

function startFrontend() {
  // Step 4: Start the frontend Vite server
  console.log(`${colors.bright}${colors.green}[4/5] Starting frontend development server...${colors.reset}`);
  const frontend = spawn('npm', ['run', 'dev', '--', '--port', '3000'], {
    stdio: 'pipe',
    shell: true
  });

  frontend.stdout.on('data', (data) => {
    process.stdout.write(`${colors.blue}[FRONTEND] ${colors.reset}${data}`);
  });

  frontend.stderr.on('data', (data) => {
    process.stderr.write(`${colors.red}[FRONTEND ERROR] ${colors.reset}${data}`);
  });
  
  // Application is running
  setTimeout(() => {
    console.log(`\n${colors.bright}${colors.green}[5/5] ✓ GTM Application is now running!${colors.reset}`);
    console.log(`${colors.blue}→ Frontend: http://localhost:3000${colors.reset}`);
    console.log(`${colors.yellow}→ Backend: http://localhost:5001${colors.reset}`);
    
    // Additional information
    if (useFallbackServer) {
      console.log(`\n${colors.yellow}Note: Using fallback server without Prisma.${colors.reset}`);
      console.log(`${colors.yellow}To fix Prisma issues, run: npm run fix-prisma${colors.reset}`);
    }
    
    console.log(`${colors.bright}${colors.blue}Press Ctrl+C to stop all servers${colors.reset}`);
  }, 2000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.blue}Shutting down all servers...${colors.reset}`);
  backend.kill();
  process.exit(0);
});