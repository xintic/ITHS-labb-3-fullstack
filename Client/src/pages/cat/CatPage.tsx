import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import ProductFilter from '@/components/ProductFilter';

type Product = {
  product_id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  average_rating: number;
  is_favorite: boolean;
};

const CatPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const location = useLocation();

  const fetchProducts = async (filters: number[] = []) => {
    try {
      const res =
        filters.length > 0
          ? await axios.post(
              '/api/products/by-parent-category/15/filtered',
              { value_ids: filters },
              { withCredentials: true }
            )
          : await axios.get('/api/products/by-parent-category/15', { withCredentials: true });

      setProducts(res.data);
    } catch (err) {
      console.error('Kunde inte hämta produkter', err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/katt') {
      fetchProducts(selectedFilters);
    }
  }, [location.pathname, selectedFilters]);
  return (
    <div className="text-center">
      <h1 className="text-xl font-bold hidden md:block">Allt inom Katt</h1>
      <nav className="mt-2 space-x-4 hidden md:block">
        <Link to="kattmat" className="text-blue-500 underline">
          Kattmat
        </Link>
        <Link to="matplats" className="text-blue-500 underline">
          Kattens Matplats
        </Link>
        <Link to="godis" className="text-blue-500 underline">
          Kattgodis
        </Link>
        <Link to="apotek" className="text-blue-500 underline">
          Kattens Apotek
        </Link>
        <Link to="skotsel" className="text-blue-500 underline">
          Kattens Skötsel
        </Link>
        <Link to="leksaker" className="text-blue-500 underline">
          Kattleksaker
        </Link>
        <Link to="sovplats" className="text-blue-500 underline">
          Kattens Sovplats
        </Link>
        <Link to="kattlador" className="text-blue-500 underline">
          Kattlådor
        </Link>
        <Link to="kattsand" className="text-blue-500 underline">
          Kattsand
        </Link>
        <Link to="utekatt" className="text-blue-500 underline">
          Till Utekatten
        </Link>
        <Link to="burar" className="text-blue-500 underline">
          Kattburar
        </Link>
        <Link to="tillbehor" className="text-blue-500 underline">
          Kattillbehör
        </Link>
        <Link to="klosmobler" className="text-blue-500 underline">
          Klösmöbler
        </Link>
      </nav>
      <Outlet />
      {location.pathname === '/katt' && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
          <div className="lg:col-span-1 text-left">
            <ProductFilter
              categoryId={15}
              selectedValues={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>

          <div className="lg:col-span-3 grid gap-y-10 gap-x-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
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
        </div>
      )}
    </div>
  );
};

export default CatPage;
