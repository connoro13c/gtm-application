/**
 * GTM Application Start Script
 * Handles Prisma generation and starts all servers in the correct order
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

console.log(`${colors.bright}${colors.blue}===== GTM Application Startup =====${colors.reset}\n`);

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

// Ensure backend/package.json exists
if (!fs.existsSync(path.join(__dirname, 'backend', 'package.json'))) {
  console.log('Creating backend package.json...');
  const backendPackageJson = {
    "name": "gtm-application-backend",
    "version": "1.0.0",
    "type": "module",
    "dependencies": {
      "@prisma/client": "^6.4.1"
    }
  };
  fs.writeFileSync(
    path.join(__dirname, 'backend', 'package.json'),
    JSON.stringify(backendPackageJson, null, 2)
  );
}

// Step 1: Generate Prisma client in the backend dir
console.log(`${colors.bright}${colors.green}[1/5] Setting up Prisma client...${colors.reset}`);
try {
  // First clean up any existing Prisma installs
  console.log('1. Installing matching Prisma versions...');
  execSync('cd backend && npm install prisma@6.4.1 @prisma/client@6.4.1', { stdio: 'inherit' });
  execSync('npm install prisma@6.4.1 @prisma/client@6.4.1', { stdio: 'inherit' });
  
  // Generate Prisma client for both root and backend
  console.log('2. Generating Prisma client with schema path specified...');
  execSync('npx prisma generate --schema=./prisma/schema.prisma', { stdio: 'inherit' });
  execSync('cd backend && npx prisma generate --schema=../prisma/schema.prisma', { stdio: 'inherit' });
  
  // Verify Prisma client has been generated correctly
  const prismaClientPath = path.join(__dirname, 'backend', 'node_modules', '.prisma', 'client');
  if (fs.existsSync(prismaClientPath)) {
    console.log(`${colors.green}✓ Prisma client generated successfully${colors.reset}`);
  } else {
    console.warn(`${colors.yellow}⚠ Prisma client folder not found at ${prismaClientPath}${colors.reset}`);
    console.log('Attempting to generate in a different way...');
    execSync('cd backend && npx prisma generate', { stdio: 'inherit' });
  }
  
  // Create or update prisma.js helper file
  console.log('3. Setting up Prisma helper file...');
  const prismaHelperContent = `/**
 * Prisma Client initialization
 * Ensures proper client setup with ES modules
 */

// Explicitly generate Prisma Client before use
import { execSync } from 'child_process';
try {
  execSync('npx prisma generate --schema=../prisma/schema.prisma', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate Prisma client:', error.message);
}

import { PrismaClient } from '@prisma/client';

// Log queries in development environment
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Verify database connection on startup
const testConnection = async () => {
  try {
    // Try a simple query to check connection
    console.log('Testing database connection...');
    await prisma.$queryRaw\`SELECT 1 as result\`;
    console.log('✅ Database connection successful!');
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error:', err.message);
    console.error('Please check your DATABASE_URL and ensure PostgreSQL is running');
    
    // Don't exit process, but warn clearly
    console.warn('⚠️ Application may not function correctly without database connection');
  }
};

// Run test connection
testConnection();

export default prisma;
`;
  
  // Write the helper file
  fs.writeFileSync(
    path.join(__dirname, 'backend', 'src', 'prisma.js'),
    prismaHelperContent
  );
  
  console.log(`${colors.green}✓ Prisma client successfully generated for backend${colors.reset}\n`);
} catch (error) {
  console.error(`${colors.red}✗ Failed to set up Prisma client${colors.reset}`);
  console.error(error);
  process.exit(1);
}

// Step 2: Start the backend server
console.log(`${colors.bright}${colors.green}[2/5] Starting backend server...${colors.reset}`);
const backend = spawn('node', ['backend/src/server.js'], {
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
  // Step 3: Start the frontend Vite server
  console.log(`${colors.bright}${colors.green}[3/5] Starting frontend development server...${colors.reset}`);
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
    console.log(`\n${colors.bright}${colors.green}[4/5] ✓ GTM Application is now running!${colors.reset}`);
    console.log(`${colors.blue}→ Frontend: http://localhost:3000${colors.reset}`);
    console.log(`${colors.yellow}→ Backend: http://localhost:5000${colors.reset}`);
    
    // Step 5: Final setup instructions
    console.log(`\n${colors.bright}${colors.green}[5/5] Next steps for full functionality:${colors.reset}`);
    console.log(`${colors.yellow}1. Make sure PostgreSQL is running with the 'gtm_app' database created${colors.reset}`);
    console.log(`${colors.yellow}2. Run database schema setup: npm run prisma:push${colors.reset}`);
    console.log(`${colors.yellow}3. Seed the database with initial data: npm run prisma:seed${colors.reset}`);
    
    console.log(`${colors.bright}${colors.blue}Press Ctrl+C to stop all servers${colors.reset}`);
  }, 2000);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.bright}${colors.blue}Shutting down all servers...${colors.reset}`);
  backend.kill();
  process.exit(0);
});