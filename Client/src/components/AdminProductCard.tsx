import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTransformedImageUrl } from '@/utils/cloudinary';

interface AdminProductCardProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  onDelete: (id: number) => void;
}

const AdminProductCard = ({
  productId,
  name,
  price,
  stock,
  imageUrl,
  onDelete
}: AdminProductCardProps) => {
  return (
    <Card className="w-full max-w-s shadow-md relative">
      <CardHeader className="flex justify-center">
        <img
          src={getTransformedImageUrl(imageUrl, 'w_200,h_200,c_fill')}
          alt={name}
          className="h-48 object-contain mb-4"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-lg font-bold" title={name}>
          {name}
        </h3>
        <p className="text-sm text-gray-500">Lager: {stock}</p>
        <p className="text-lg font-semibold">{price} kr</p>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={() => onDelete(productId)} className="w-full">
          Ta bort
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminProductCard;
