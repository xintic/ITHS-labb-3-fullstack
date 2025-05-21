import { Router, Request, Response } from 'express';
import {
  authenticateToken,
  authorizeRole
} from '../authentication/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.post('/add-product', async (req: Request, res: Response) => {
  res.json({ message: 'Produkt tillagd!' });
});

export default router;
