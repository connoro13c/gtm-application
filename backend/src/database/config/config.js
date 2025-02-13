import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get environment variables with fallbacks
const {
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'gtm_scoring_dev',
  DB_HOST = 'localhost',
  NODE_ENV = 'development'
} = typeof process !== 'undefined' && process.env ? process.env : {};

const config = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_NAME}_test`,
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
};

export default config; 