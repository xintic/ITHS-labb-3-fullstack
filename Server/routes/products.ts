import { Router, Request, Response } from 'express';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av produkter:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM product p
       JOIN category c ON p.category_id = c.category_id
       WHERE p.product_id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkten hittades inte.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid hämtning av produkt:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
    const { name, description, price, stock, image_url, category_id } =
      req.body;
    try {
      const result = await pool.query(
        `INSERT INTO product (name, description, price, stock, image_url, category_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, price, stock, image_url, category_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid skapande av produkt:', err);
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
    const { name, description, price, stock, image_url, category_id } =
      req.body;
    try {
      const result = await pool.query(
        `UPDATE product
         SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category_id = $6
         WHERE product_id = $7
         RETURNING *`,
        [name, description, price, stock, image_url, category_id, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Produkten hittades inte.' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid uppdatering av produkt:', err);
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
        `DELETE FROM product WHERE product_id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Produkten hittades inte.' });
      }
      res.json({
        message: 'Produkten har tagits bort.',
        product: result.rows[0]
      });
    } catch (err) {
      console.error('Fel vid borttagning av produkt:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

export default router;
