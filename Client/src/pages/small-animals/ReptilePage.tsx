import { useEffect, useState } from 'react';
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

const ReptilePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  const fetchProducts = async (filters: number[] = []) => {
    try {
      const res =
        filters.length > 0
          ? await axios.post(
              '/api/products/by-category/35/filtered',
              { value_ids: filters },
              { withCredentials: true }
            )
          : await axios.get('/api/products/category/35', { withCredentials: true });

      setProducts(res.data);
    } catch (err) {
      console.error('Kunde inte hämta produkter', err);
    }
  };

  useEffect(() => {
    fetchProducts(selectedFilters);
  }, [selectedFilters]);

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6 mx-auto">
      <div className="lg:col-span-1 text-left">
        <ProductFilter
          categoryId={35}
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
  );
};

export default ReptilePage;
