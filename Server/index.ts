import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/authentication';
import adminRoutes from './routes/admin';
import searchRoutes from './routes/search';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import customerRoutes from './routes/customers';
import reviewRoutes from './routes/reviews';
import orderRoutes from './routes/orders';
import attributeRoutes from './routes/attributes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 8080;

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true
//   })
// );
app.use(express.static(path.join(path.resolve(), 'dist')));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/attributes', attributeRoutes);

app.listen(PORT, () => {
  console.log(`Redo på http://localhost:${PORT}`);
});
