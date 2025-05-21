import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

type RegisterBody = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

router.post(
  '/register',
  async (req: Request<any, any, RegisterBody>, res: Response) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Alla fält krävs.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO Customer (first_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING customer_id, first_name, last_name, email, role`,
        [first_name, last_name, email, hashedPassword]
      );

      const user = result.rows[0];
      res.status(201).json({ message: 'Registrerad!', user });
    } catch (err: any) {
      if (err.code === '23505') {
        res
          .status(409)
          .json({ message: 'E-postadressen är redan registrerad.' });
      } else {
        console.error(err);
        res.status(500).json({ message: 'Serverfel.' });
      }
    }
  }
);

router.post(
  '/login',
  async (req: Request<any, any, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await pool.query(
        'SELECT * FROM Customer WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      if (!user)
        return res.status(401).json({ message: 'Fel e-post eller lösenord.' });

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch)
        return res.status(401).json({ message: 'Fel e-post eller lösenord.' });

      const token = jwt.sign(
        {
          customer_id: user.customer_id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Serverfel.' });
    }
  }
);

export default router;
