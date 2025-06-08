import { Router, Request, Response } from 'express';
import slugify from 'slugify';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.post('/products', async (req: Request, res: Response) => {
  const { name, description, price, stock, image_url, category_id } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  try {
    const result = await pool.query(
      `INSERT INTO product (name, description, price, stock, image_url, category_id, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, price, stock, image_url, category_id, slug]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid skapande av produkt:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category_id } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  try {
    const result = await pool.query(
      `UPDATE product
       SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category_id = $6, slug = $8
       WHERE product_id = $7
       RETURNING *`,
      [name, description, price, stock, image_url, category_id, id, slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkten hittades inte.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid uppdatering av produkt:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
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
});

router.get('/orders', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY order_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av ordrar:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.delete('/orders/:order_id', async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM orderproduct WHERE order_id = $1`, [
      order_id
    ]);
    const result = await client.query(
      `DELETE FROM orders WHERE order_id = $1 RETURNING *`,
      [order_id]
    );
    await client.query('COMMIT');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ordern hittades inte.' });
    }
    res.json({ message: 'Ordern har tagits bort.', order: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Fel vid borttagning av order:', err);
    res.status(500).json({ message: 'Serverfel' });
  } finally {
    client.release();
  }
});

router.put('/orders/:order_id/status', async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *`,
      [status, order_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ordern hittades inte.' });
    }
    res.json({ message: 'Orderstatus uppdaterad.', order: result.rows[0] });
  } catch (err) {
    console.error('Fel vid uppdatering av orderstatus:', err);
    res.status(500).json({ message: 'Serverfel vid uppdatering.' });
  }
});

export default router;
