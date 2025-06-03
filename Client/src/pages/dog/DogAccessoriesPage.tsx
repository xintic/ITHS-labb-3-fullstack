import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';

type Product = {
  product_id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  average_rating: number;
  is_favorite: boolean;
};

const DogAccessoriesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get('/api/products/category/13', { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Kunde inte hämta produkter', err));
  }, []);

  return (
    <div className="mx-auto p-4 grid gap-y-10 gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center max-w-screen-xl">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          productId={product.product_id}
          name={product.name}
          slug={product.slug}
          price={product.price}
          imageUrl={product.image_url}
          averageRating={product.average_rating}
          isFavorite={product.is_favorite}
        />
      ))}
    </div>
  );
};

export default DogAccessoriesPage;
