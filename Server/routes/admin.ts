import { Router, Request, Response } from 'express';
import slugify from 'slugify';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

// Alla routes här kräver admin-auth
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Skapa en ny produkt
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

// Uppdatera en produkt
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

// Ta bort en produkt
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

export default router;
