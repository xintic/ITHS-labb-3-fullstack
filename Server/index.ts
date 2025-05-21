import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import pool from './db';
import authRouter from './routes/authentication';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Redo på http://localhost:${PORT}`);
});
