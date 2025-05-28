import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    axios
      .get(`/api/search?query=${query}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Kunde inte hämta sökresultat', err))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sökresultat för "{query}"</h1>
      {loading ? (
        <p>Laddar...</p>
      ) : products.length === 0 ? (
        <p>Inga produkter hittades.</p>
      ) : (
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
      )}
    </div>
  );
};

export default SearchResultsPage;
