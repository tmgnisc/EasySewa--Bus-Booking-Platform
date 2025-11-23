import dotenv from 'dotenv';
import { syncDatabase } from '../models/index.js';

dotenv.config();

const force = process.argv.includes('--force');

syncDatabase(force)
  .then(() => {
    console.log('✅ Database sync completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  });

