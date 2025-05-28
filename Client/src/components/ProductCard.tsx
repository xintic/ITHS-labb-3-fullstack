import { Link } from 'react-router-dom';
import { getTransformedImageUrl } from '@/utils/cloudinary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FaStar } from 'react-icons/fa';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useCartStore } from '@/stores/cartStore';

type Props = {
  productId: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  averageRating: number;
  isFavorite: boolean;
};

const ProductCard = ({
  productId,
  name,
  slug,
  price,
  imageUrl,
  averageRating,
  isFavorite
}: Props) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({ productId, name, price, quantity: 1 });
  };

  return (
    <Card className="w-full max-w-s shadow-md">
      <Link to={`/produkt/${slug}`} aria-label={`Visa ${name}`}>
        <CardHeader className="flex justify-center">
          <img
            src={getTransformedImageUrl(imageUrl, 'w_200,h_200,c_fill')}
            alt={name}
            className="h-48 object-contain mb-4"
          />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-row">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={i < averageRating ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="ml-2">
              {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </div>
          </div>
          <p className="text-sm text-start font-semibold">{name}</p>
          <p className="text-lg font-bold">{price} kr</p>
        </CardContent>
      </Link>
      <CardFooter>
        <Button className="w-full cursor-pointer" onClick={handleAddToCart}>
          Köp nu
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
