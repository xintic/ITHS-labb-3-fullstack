import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { Client } from 'pg';

dotenv.config();

const app = express();
const PORT = 8080;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const db = new Client({
  connectionString: process.env.PGURI
});

db.connect()
  .then(() => {
    console.log('Ansluten till databasen!');
  })
  .catch((err) => {
    console.error('Fel vid anslutning till databasen:', err);
  });

app.use(cors());

app.listen(PORT, () => {
  console.log(`Redo på http://localhost:${PORT}`);
});
