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

const SmallAnimalsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const location = useLocation();

  const fetchProducts = async (filters: number[] = []) => {
    try {
      const res =
        filters.length > 0
          ? await axios.post(
              '/api/products/by-parent-category/29/filtered',
              { value_ids: filters },
              { withCredentials: true }
            )
          : await axios.get('/api/products/by-parent-category/29', { withCredentials: true });

      setProducts(res.data);
    } catch (err) {
      console.error('Kunde inte hämta produkter', err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/smadjur') {
      fetchProducts(selectedFilters);
    }
  }, [location.pathname, selectedFilters]);

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
      {location.pathname === '/smadjur' && (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
          <div className="lg:col-span-1 text-left">
            <ProductFilter
              categoryId={29}
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

export default SmallAnimalsPage;
