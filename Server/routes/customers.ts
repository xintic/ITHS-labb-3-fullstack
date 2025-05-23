import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../authentication/authMiddleware';

const router = Router();

router.get(
  '/me/favorites',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `SELECT p.*
       FROM product p
       JOIN customerproduct cp ON p.product_id = cp.product_id
       WHERE cp.customer_id = $1`,
        [req.user!.customer_id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Fel vid hämtning av favoriter:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.post(
  '/me/favorites/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await pool.query(
        `INSERT INTO customerproduct (customer_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
        [req.user!.customer_id, id]
      );
      res.status(201).json({ message: 'Produkt tillagd som favorit.' });
    } catch (err) {
      console.error('Fel vid tillägg av favorit:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.delete(
  '/me/favorites/:id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM customerproduct
       WHERE customer_id = $1 AND product_id = $2
       RETURNING *`,
        [req.user!.customer_id, id]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: 'Produkten fanns inte i favoriter.' });
      }

      res.json({ message: 'Produkten togs bort från favoriter.' });
    } catch (err) {
      console.error('Fel vid borttagning av favorit:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

export default router;
