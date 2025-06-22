import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PGURI
});

pool.on('connect', () => {
  console.log('Pool-ansluten till databasen');
});

export default pool;
