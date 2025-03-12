-- Create role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres' SUPERUSER;
  END IF;
END
$$;

-- Grant database ownership
ALTER DATABASE gtm_app OWNER TO postgres;

-- Connect to the database and grant schema privileges
\c gtm_app;

-- Grant all privileges on schema
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;

-- Grant all privileges on all tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO postgres;

-- Ensure the user is a superuser (needed for some Prisma operations)
ALTER ROLE postgres WITH SUPERUSER;

-- Output success message
SELECT 'Permissions granted successfully' AS result;