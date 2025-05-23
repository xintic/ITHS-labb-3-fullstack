import { Router, Request, Response } from 'express';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM attribute');
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av attribut:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get('/:id/values', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM attributevalue WHERE attribute_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av attributvärden:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO attribute (name) VALUES ($1) RETURNING *`,
        [name]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid skapande av attribut:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.post(
  '/:id/values',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO attributevalue (attribute_id, value)
       VALUES ($1, $2) RETURNING *`,
        [id, value]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid skapande av attributvärde:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

export default router;
