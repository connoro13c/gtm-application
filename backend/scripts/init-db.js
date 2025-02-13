import initializeDatabase from '../src/database/init.js';

console.log('Starting database initialization...');

initializeDatabase()
  .then((success) => {
    if (success) {
      console.log('Database initialization completed successfully.');
      process.exit(0);
    } else {
      console.error('Database initialization failed.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error during database initialization:', error);
    process.exit(1);
  }); 