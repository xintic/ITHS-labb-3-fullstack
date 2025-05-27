import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: 'Query saknas' });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        p.product_id,
        p.name,
        p.slug,
        p.price,
        p.image_url,
        c.name AS category_name
      FROM product p
      JOIN category c ON p.category_id = c.category_id
      LEFT JOIN categoryproduct cp ON p.product_id = cp.product_id
      LEFT JOIN category c2 ON cp.category_id = c2.category_id
      LEFT JOIN productattributevalue pav ON p.product_id = pav.product_id
      LEFT JOIN attributevalue av ON pav.value_id = av.value_id
      WHERE 
        p.name ILIKE $1 OR
        c.name ILIKE $1 OR
        c2.name ILIKE $1 OR
        av.value ILIKE $1
      GROUP BY p.product_id, c.name
      `,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Sökfel:', err);
    res.status(500).json({ message: 'Serverfel vid sökning' });
  }
});

export default router;
