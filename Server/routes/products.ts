import { Router, Request, Response } from 'express';
import slugify from 'slugify';
import pool from '../db';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';
import jwt from 'jsonwebtoken';
import { MyJwtPayload } from '../authentication/authMiddleware';

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

router.get('/category/:id', async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const token = req.cookies.token;
  let userId: number | null = null;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as MyJwtPayload;
      userId = decoded.customer_id;
    } catch (err) {
      userId = null;
    }
  }
  try {
    const result = await pool.query(
      `
      SELECT 
        p.product_id,
        p.name,
        p.price,
        p.image_url,
        p.slug,
        COALESCE(AVG(r.rating), 0)::numeric(2,1) AS average_rating,
        CASE 
          WHEN $2::int IS NOT NULL AND cp.customer_id IS NOT NULL THEN true
          ELSE false
        END AS is_favorite
      FROM product p
      LEFT JOIN review r ON p.product_id = r.product_id
      LEFT JOIN customerproduct cp 
        ON p.product_id = cp.product_id AND cp.customer_id = $2
      WHERE p.category_id = $1
      GROUP BY p.product_id, cp.customer_id
      `,
      [categoryId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av produkter per kategori:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get('/slug/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const token = req.cookies.token;
  let userId: number | null = null;
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as MyJwtPayload;
      userId = decoded.customer_id;
    } catch {
      userId = null;
    }
  }
  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        c.name AS category_name,
        COALESCE(AVG(r.rating), 0)::numeric(2,1) AS average_rating,
        CASE 
          WHEN $2::int IS NOT NULL AND cp.customer_id IS NOT NULL THEN true
          ELSE false
        END AS is_favorite
      FROM product p
      LEFT JOIN review r ON p.product_id = r.product_id
      LEFT JOIN customerproduct cp ON p.product_id = cp.product_id AND cp.customer_id = $2
      JOIN category c ON p.category_id = c.category_id
      WHERE p.slug = $1
      GROUP BY p.product_id, c.name, cp.customer_id
      `,
      [slug, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkten hittades inte.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fel vid hämtning av produkt via slug:', err);
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

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT * FROM product WHERE slug = $1', [
      slug
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produkt hittades inte.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Fel vid hämtning av produkt med slug:', slug, error);
    res.status(500).json({ message: 'Serverfel.' });
  }
});

export default router;
