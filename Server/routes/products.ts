import { Router, Request, Response } from 'express';
import pool from '../db';
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
    } catch {
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

router.get(
  '/by-parent-category/:parentId',
  async (req: Request, res: Response) => {
    const parentId = req.params.parentId;
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
      JOIN category c ON p.category_id = c.category_id
      LEFT JOIN review r ON p.product_id = r.product_id
      LEFT JOIN customerproduct cp ON p.product_id = cp.product_id AND cp.customer_id = $2
      WHERE c.parent_id = $1
      GROUP BY p.product_id, cp.customer_id
      `,
        [parentId, userId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('Fel vid hämtning av produkter för huvudkategori:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.get('/filters/:categoryId', async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const result = await pool.query(
      `
      SELECT DISTINCT
        av.value_id,
        av.value,
        a.attribute_id,
        a.name AS attribute_name
      FROM product p
      JOIN productattributevalue pav ON p.product_id = pav.product_id
      JOIN attributevalue av ON pav.value_id = av.value_id
      JOIN attribute a ON av.attribute_id = a.attribute_id
      JOIN category c ON p.category_id = c.category_id
      WHERE c.category_id = $1 OR c.parent_id = $1
      ORDER BY a.name, av.value;
      `,
      [categoryId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av filtervärden:', err);
    res.status(500).json({ message: 'Serverfel vid hämtning av filterdata.' });
  }
});

router.post(
  '/by-parent-category/:parentId/filtered',
  async (req: Request, res: Response) => {
    const parentId = req.params.parentId;
    const { value_ids } = req.body;
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

    const priceConditions = [
      { id: -1, condition: 'p.price < 100' },
      { id: -100, condition: 'p.price >= 100 AND p.price < 250' },
      { id: -250, condition: 'p.price >= 250 AND p.price < 500' },
      { id: -500, condition: 'p.price >= 500 AND p.price < 1000' },
      { id: -1000, condition: 'p.price >= 1000' }
    ];

    const regularValues = value_ids.filter((id: number) => id > 0);
    const priceFilters = priceConditions.filter((pc) =>
      value_ids.includes(pc.id)
    );

    const priceSQL = priceFilters.map((pf) => `(${pf.condition})`).join(' OR ');

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
        JOIN category c ON p.category_id = c.category_id
        LEFT JOIN review r ON p.product_id = r.product_id
        LEFT JOIN customerproduct cp ON p.product_id = cp.product_id AND cp.customer_id = $2
        LEFT JOIN productattributevalue pav ON pav.product_id = p.product_id
        WHERE (c.parent_id = $1 OR c.category_id = $1)
        ${regularValues.length > 0 ? `AND pav.value_id = ANY($3)` : ''}
        ${priceFilters.length > 0 ? `AND (${priceSQL})` : ''}
        GROUP BY p.product_id, cp.customer_id
        `,
        regularValues.length > 0
          ? [parentId, userId, regularValues]
          : [parentId, userId]
      );

      res.json(result.rows);
    } catch (err) {
      console.error('Fel vid filtrerad hämtning:', err);
      res.status(500).json({ message: 'Serverfel vid filtrerad hämtning.' });
    }
  }
);

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

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT category_id, name FROM category ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av kategorier:', err);
    res.status(500).json({ message: 'Serverfel vid hämtning av kategorier.' });
  }
});

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
