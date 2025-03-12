/**
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
