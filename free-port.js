/**
 * Port freeing script
 * Finds and kills processes using specified ports
 */

import { execSync } from 'child_process';

const ports = [5000, 3000];

console.log('===== Freeing ports for GTM Application =====');

ports.forEach(port => {
  console.log(`Checking port ${port}...`);
  
  try {
    if (process.platform === 'win32') {
      // Windows
      execSync(`for /f "tokens=5" %a in ('netstat -ano | findstr :${port}') do taskkill /F /PID %a`, { stdio: 'ignore' });
    } else {
      // macOS/Linux
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
    }
    console.log(`\u2713 Port ${port} is now free`);
  } catch (error) {
    // Ignore errors - likely means no process was running on that port
    console.log(`\u2713 No processes found on port ${port}`);
  }
});

console.log('\n\u2705 All ports freed successfully!');
console.log('You can now run: npm run start:robust');