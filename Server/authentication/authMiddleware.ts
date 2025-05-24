import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface MyJwtPayload extends JwtPayload {
  customer_id: number;
  email: string;
  role: 'admin' | 'customer';
}

declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err || !decoded) return res.sendStatus(403);
      req.user = decoded as MyJwtPayload;
      next();
    }
  );
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
