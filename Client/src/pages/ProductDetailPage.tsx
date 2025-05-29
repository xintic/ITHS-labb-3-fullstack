import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_name: string;
  average_rating: number;
  is_favorite: boolean;
}

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    axios
      .get(`/api/products/slug/${slug}`, { withCredentials: true })
      .then((res) => {
        setProduct(res.data);
        setUserRating(res.data.average_rating);
        setIsFavorite(res.data.is_favorite);
      })
      .catch((err) => console.error('Kunde inte hämta produkt', err));
  }, [slug]);

  const handleRating = (value: number) => {
    if (!product) return;
    setUserRating(value);
    axios
      .post(
        `/api/reviews/product/${product.product_id}`,
        { rating: value, comment: '' },
        { withCredentials: true }
      )
      .then(() => {
        console.log('Betyg sparat');
      })
      .catch((err) => {
        console.error('Kunde inte spara betyg', err);
      });
  };
  const toggleFavorite = () => {
    if (!product) return;

    const url = `/api/customers/user/favorites/${product.product_id}`;
    const method = isFavorite ? axios.delete : axios.post;

    method(url, {}, { withCredentials: true })
      .then(() => {
        setIsFavorite(!isFavorite);
      })
      .catch((err) => {
        console.error('Kunde inte uppdatera favorit', err);
      });
  };
  if (!product) return <p>Laddar...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full max-h-96 object-contain mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-2">{product.category_name}</p>
      <div className="flex items-center mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            className={`cursor-pointer transition-colors ${
              (hoverRating || userRating) > i ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRating(i + 1)}
          />
        ))}
        <div className="ml-3 cursor-pointer" onClick={toggleFavorite}>
          {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </div>
      </div>
      <p className="text-lg font-semibold mb-4">{product.price} kr</p>
      <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
    </div>
  );
};

export default ProductDetailPage;
