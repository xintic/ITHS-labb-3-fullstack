import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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

const SmallAnimalsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/smadjur') {
      axios
        .get('/api/products/by-parent-category/29', { withCredentials: true })
        .then((res) => setProducts(res.data))
        .catch((err) => console.error('Kunde inte hämta produkter', err));
    }
  }, [location.pathname]);

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold hidden md:block">Allt inom Smådjur</h1>
      <nav className="mt-2 space-x-4 hidden md:block">
        <Link to="kanin" className="text-blue-500 underline">
          Kanin
        </Link>
        <Link to="marsvin" className="text-blue-500 underline">
          Marsvin
        </Link>
        <Link to="hamster" className="text-blue-500 underline">
          Hamster
        </Link>
        <Link to="fagel" className="text-blue-500 underline">
          Fågel
        </Link>
        <Link to="akvariefisk" className="text-blue-500 underline">
          Akvariefisk
        </Link>
        <Link to="reptil" className="text-blue-500 underline">
          Reptil
        </Link>
        <Link to="ovriga" className="text-blue-500 underline">
          Övriga Smådjur
        </Link>
      </nav>
      <Outlet />
      {location.pathname === '/hund' && (
        <div className="grid gap-y-10 gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center max-w-screen-xl mx-auto">
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
      )}
    </div>
  );
};

export default SmallAnimalsPage;
