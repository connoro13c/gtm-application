/**
 * Database Permissions Fix Script
 * Sets up PostgreSQL permissions for the GTM application
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('===== PostgreSQL Permission Fix =====');

// Get database connection details from .env
let dbUrl = 'postgresql://postgres:postgres@localhost:5432/gtm_app?schema=public';
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL=\"(.+)\"/); 
  if (dbUrlMatch && dbUrlMatch[1]) {
    dbUrl = dbUrlMatch[1];
  }
}

// Parse the database URL for components
const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/([^?]+)(?:\?schema=([^&]+))?/;
const matches = dbUrl.match(urlPattern);

if (!matches) {
  console.error('Invalid DATABASE_URL format');
  process.exit(1);
}

const [
  ,
  dbUser,
  dbPassword,
  dbHost,
  dbPort,
  dbName,
  dbSchema = 'public'
] = matches;

console.log(`Database: ${dbName}`);
console.log(`User: ${dbUser}`);
console.log(`Host: ${dbHost}:${dbPort}`);
console.log(`Schema: ${dbSchema}`);

// Create SQL script to fix permissions
const fixSql = `
-- Create role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${dbUser}') THEN
    CREATE ROLE ${dbUser} WITH LOGIN PASSWORD '${dbPassword}';
  END IF;
END
$$;

-- Grant database ownership
ALTER DATABASE ${dbName} OWNER TO ${dbUser};

-- Connect to the database and grant schema privileges
\c ${dbName};

-- Grant all privileges on schema
GRANT ALL PRIVILEGES ON SCHEMA ${dbSchema} TO ${dbUser};

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${dbSchema} TO ${dbUser};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ${dbSchema} TO ${dbUser};
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA ${dbSchema} TO ${dbUser};

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA ${dbSchema} GRANT ALL PRIVILEGES ON TABLES TO ${dbUser};
ALTER DEFAULT PRIVILEGES IN SCHEMA ${dbSchema} GRANT ALL PRIVILEGES ON SEQUENCES TO ${dbUser};
ALTER DEFAULT PRIVILEGES IN SCHEMA ${dbSchema} GRANT ALL PRIVILEGES ON FUNCTIONS TO ${dbUser};

-- Ensure the user is a superuser (needed for some Prisma operations)
ALTER ROLE ${dbUser} WITH SUPERUSER;

-- Output success message
SELECT 'Permissions granted successfully' AS result;
`;

// Save SQL to a file
const sqlPath = path.join(__dirname, 'fix-permissions.sql');
fs.writeFileSync(sqlPath, fixSql);
console.log(`SQL script created at ${sqlPath}`);

// Run SQL as postgres superuser
try {
  console.log('\nRunning permission fix script...');
  console.log('You may need to enter your password for the postgres superuser');
  execSync(`psql -U postgres -f ${sqlPath}`, { stdio: 'inherit' });
  console.log('\n✅ Database permissions have been fixed!');
} catch (error) {
  console.error('\n❌ Failed to run SQL script:', error.message);
  console.log('\nYou may need to run this manually as a PostgreSQL superuser:');
  console.log(`psql -U postgres -f ${sqlPath}`);
}

console.log('\nNow you can run the application with: npm run start:robust');