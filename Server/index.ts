import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI
});

client
  .connect()
  .then(() => {
    console.log('✅ Ansluten till databasen!');
  })
  .catch((err) => {
    console.error('❌ Fel vid anslutning till databasen:', err);
  });
