import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../authentication/authMiddleware';

const router = Router();

router.put('/user', authenticateToken, async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    phone,
    address,
    care_of,
    postal_code,
    city,
    door_code
  } = req.body;

  try {
    await pool.query(
      `UPDATE customer
         SET first_name = $1,
             last_name = $2,
             phone = $3,
             address = $4,
             care_of = $5,
             postal_code = $6,
             city = $7,
             door_code = $8
         WHERE customer_id = $9`,
      [
        first_name,
        last_name,
        phone,
        address,
        care_of,
        postal_code,
        city,
        door_code,
        req.user!.customer_id
      ]
    );
    res.status(200).json({ message: 'Profilen uppdaterad.' });
  } catch (err) {
    console.error('Fel vid uppdatering av användare:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get(
  '/user/favorites',
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
  '/user/favorites/:id',
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
  '/user/favorites/:id',
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
