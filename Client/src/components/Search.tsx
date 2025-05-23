import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { LuSearch } from 'react-icons/lu';

type Product = {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  category_name: string;
};

export default function SearchProducts() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Kunde inte hämta sökresultat', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchResults();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, fetchResults]);

  return (
    <div className="max-w-2xl p-4">
      <div className="flex items-center bg-amber-50 border border-gray-300 px-4 py-2 shadow-sm">
        <LuSearch className="text-xl text-black mr-2" />
        <input
          type="text"
          placeholder="Sök bland produkter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
        />
      </div>

      {loading && <p className="mt-2 text-sm text-gray-600">Söker...</p>}

      <ul className="space-y-2">
        {results.map((product) => (
          <li key={product.product_id} className="p-3 border rounded shadow-sm bg-white">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category_name}</p>
            <p className="text-sm">{product.price} kr</p>
          </li>
        ))}
        {!loading && results.length === 0 && query && (
          <li className="text-gray-500 mt-2">Inga matchningar hittades.</li>
        )}
      </ul>
    </div>
  );
}
