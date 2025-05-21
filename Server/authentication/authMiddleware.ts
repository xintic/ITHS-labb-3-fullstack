import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as JwtPayload;
    next();
  });
};

export const authorizeRole = (role: 'admin' | 'customer') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res
        .status(403)
        .json({ message: 'Åtkomst nekad. Otillräckliga rättigheter.' });
    }
    next();
  };
};

interface JwtPayload {
  customer_id: number;
  email: string;
  role: 'admin' | 'customer';
}
