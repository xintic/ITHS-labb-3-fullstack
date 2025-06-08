import { Router, Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_date DESC`,
      [req.user!.customer_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fel vid hämtning av ordrar:', err);
    res.status(500).json({ message: 'Serverfel' });
  }
});

router.get(
  '/:order_id',
  authenticateToken,
  async (req: Request, res: Response) => {
    const { order_id } = req.params;

    try {
      const result = await pool.query(
        `SELECT 
           o.order_id,
           o.customer_id,
           o.order_date,
           o.total_amount,
           o.shipping_method,
           o.payment_method,
           op.product_id,
           op.quantity,
           op.unit_price,
           p.name AS product_name,
           p.image_url
         FROM orders o
         JOIN orderproduct op ON o.order_id = op.order_id
         JOIN product p ON op.product_id = p.product_id
         WHERE o.order_id = $1 AND o.customer_id = $2`,
        [order_id, req.user!.customer_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Ordern hittades inte.' });
      }

      const base = result.rows[0];

      const order = {
        order_id: base.order_id,
        customer_id: base.customer_id,
        created_at: base.order_date,
        total_price: base.total_amount,
        shipping_method: base.shipping_method,
        payment_method: base.payment_method,
        items: result.rows.map((row) => ({
          product_id: row.product_id,
          name: row.product_name,
          quantity: row.quantity,
          unit_price: row.unit_price,
          image_url: row.image_url
        }))
      };

      res.json(order);
    } catch (err) {
      console.error('Fel vid hämtning av order:', err);
      res.status(500).json({ message: 'Serverfel' });
    }
  }
);

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { items, shipping_method, payment_method } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productsTotal = items.reduce(
      (sum: number, item: any) => sum + item.unit_price * item.quantity,
      0
    );

    const shippingPrices: Record<string, number> = {
      budbee: 59,
      best: 59,
      airmee: 69,
      postnord_ombud: 49,
      postnord_home: 79
    };

    const shippingCost =
      productsTotal >= 799 ? 0 : shippingPrices[shipping_method] ?? 0;
    const totalAmount = productsTotal + shippingCost;
    const orderResult = await client.query(
      `
      INSERT INTO orders (customer_id, status, checkout_id, shipping_method, payment_method, total_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        req.user!.customer_id,
        'Behandlas',
        uuidv4(),
        shipping_method,
        payment_method,
        totalAmount
      ]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO orderproduct (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.order_id, item.product_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');
    res
      .status(201)
      .json({ message: 'Ordern har skapats.', order_id: order.order_id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Fel vid skapande av order:', err);
    res.status(500).json({ message: 'Serverfel' });
  } finally {
    client.release();
  }
});

router.put(
  '/:order_id/status',
  authenticateToken,
  authorizeRole('admin'),
  async (req: Request, res: Response) => {
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
  }
);

export default router;
