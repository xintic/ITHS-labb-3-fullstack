import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuSearch } from 'react-icons/lu';
import { getTransformedImageUrl } from '@/utils/cloudinary';

type Product = {
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  category_name: string;
  slug: string;
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchResults = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/search?query=${query}`);
      setResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error('Kunde inte hämta sökresultat', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim()) {
        fetchResults();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(debounce);
  }, [query, fetchResults]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (slug: string) => {
    setQuery('');
    setShowResults(false);
    navigate(`/produkt/${slug}`);
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/sok?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setShowResults(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl py-4">
      <div className="flex items-center bg-amber-50 border border-gray-300 px-4 py-2 shadow-sm rounded">
        <LuSearch className="text-xl text-black mr-2" />
        <input
          type="text"
          name="search"
          placeholder="Sök bland produkter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSubmit}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
          aria-label="Sök efter produkter"
          autoComplete="off"
        />
      </div>

      {showResults && (
        <ul
          className="absolute left-0 right-0 z-50 bg-white border border-gray-300 rounded shadow-md mt-1 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {loading && <li className="p-3 text-sm text-gray-600">Söker...</li>}
          {!loading && results.length === 0 && (
            <li className="p-3 text-sm text-gray-500">Inga matchningar hittades.</li>
          )}
          {!loading &&
            results.map((product) => (
              <li
                key={product.product_id}
                onClick={() => handleSelectProduct(product.slug)}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                role="option"
              >
                <img
                  src={getTransformedImageUrl(product.image_url, 'w_64,h_64,c_fill')}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category_name}</p>
                  <p className="text-sm">{product.price} kr</p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
