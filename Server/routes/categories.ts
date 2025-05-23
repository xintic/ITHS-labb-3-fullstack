import { Router, Request, Response } from 'express';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM category');
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av kategorier:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get('/:id/products', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*
       FROM product p
       JOIN category c ON p.category_id = c.category_id
       WHERE c.category_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av produkter i kategori:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { name, parent_id } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO category (name, parent_id)
         VALUES ($1, $2)
         RETURNING *`,
        [name, parent_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid skapande av kategori:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, parent_id } = req.body;
    try {
      const result = await pool.query(
        `UPDATE category SET name = $1, parent_id = $2 WHERE category_id = $3 RETURNING *`,
        [name, parent_id, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Kategorin hittades inte.' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid uppdatering av kategori:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM category WHERE category_id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Kategorin hittades inte.' });
      }
      res.json({
        message: 'Kategorin har tagits bort.',
        category: result.rows[0]
      });
    } catch (err) {
      console.error('Fel vid borttagning av kategori:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

export default router;
