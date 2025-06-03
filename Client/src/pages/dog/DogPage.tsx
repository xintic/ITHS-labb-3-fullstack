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

const DogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/hund') {
      axios
        .get('/api/products/by-parent-category/1', { withCredentials: true })
        .then((res) => setProducts(res.data))
        .catch((err) => console.error('Kunde inte hämta produkter', err));
    }
  }, [location.pathname]);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32">
      <h1 className="text-xl font-bold hidden md:block mt-6">Allt inom Hund</h1>
      <nav className="mt-4 mb-8 space-x-4 hidden md:block">
        <Link to="hundmat" className="text-blue-500 underline">
          Hundmat
        </Link>
        <Link to="matplats" className="text-blue-500 underline">
          Hundens Matplats
        </Link>
        <Link to="godis" className="text-blue-500 underline">
          Hundgodis
        </Link>
        <Link to="apotek" className="text-blue-500 underline">
          Hundens Apotek
        </Link>
        <Link to="skotsel" className="text-blue-500 underline">
          Hundens Skötsel
        </Link>
        <Link to="leksaker" className="text-blue-500 underline">
          Hundleksaker
        </Link>
        <Link to="sovplats" className="text-blue-500 underline">
          Hundens Sovplats
        </Link>
        <Link to="promenad" className="text-blue-500 underline">
          Hundpromenad
        </Link>
        <Link to="klader" className="text-blue-500 underline">
          Hundkläder
        </Link>
        <Link to="burar" className="text-blue-500 underline">
          Hundburar
        </Link>
        <Link to="traning" className="text-blue-500 underline">
          Hundträning
        </Link>
        <Link to="tillbehor" className="text-blue-500 underline">
          Hundtillbehör
        </Link>
        <Link to="for-husse-och-matte" className="text-blue-500 underline">
          För Husse & Matte
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

export default DogPage;
