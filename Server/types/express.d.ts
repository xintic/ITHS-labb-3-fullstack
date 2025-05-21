import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        customer_id: number;
        email: string;
        role: 'admin' | 'customer';
      };
    }
  }
}

export {};
