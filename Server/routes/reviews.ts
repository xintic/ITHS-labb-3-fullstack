import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../authentication/authMiddleware';

const router = Router();

router.get('/product/:product_id', async (req: Request, res: Response) => {
  const { product_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, c.first_name, c.last_name
       FROM review r
       JOIN customer c ON r.customer_id = c.customer_id
       WHERE r.product_id = $1
       ORDER BY r.review_date DESC`,
      [product_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av recensioner:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.post(
  '/product/:product_id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { product_id } = req.params;
    const { rating, comment } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO review (customer_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
        [req.user!.customer_id, product_id, rating, comment]
      );
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      if (err.code === '23505') {
        res
          .status(409)
          .json({ message: 'Du har redan recenserat denna produkt.' });
      } else {
        console.error('Fel vid skapande av recension:', err);
        res.status(500).json({ message: 'Serverfel' });
      }
    }
  }
);

router.put(
  '/:review_id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { review_id } = req.params;
    const { rating, comment } = req.body;
    try {
      const result = await pool.query(
        `UPDATE review
       SET rating = $1, comment = $2, review_date = CURRENT_TIMESTAMP
       WHERE review_id = $3 AND customer_id = $4
       RETURNING *`,
        [rating, comment, review_id, req.user!.customer_id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({
            message: 'Recensionen hittades inte eller tillhör inte dig.'
          });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Fel vid uppdatering av recension:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.delete(
  '/:review_id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { review_id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM review
       WHERE review_id = $1 AND customer_id = $2
       RETURNING *`,
        [review_id, req.user!.customer_id]
      );
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({
            message: 'Recensionen hittades inte eller tillhör inte dig.'
          });
      }
      res.json({ message: 'Recensionen har tagits bort.' });
    } catch (err) {
      console.error('Fel vid borttagning av recension:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

export default router;
