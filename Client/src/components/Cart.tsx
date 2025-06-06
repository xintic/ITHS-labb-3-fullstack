import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { LuShoppingCart } from 'react-icons/lu';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getTransformedImageUrl } from '@/utils/cloudinary';

const Cart = () => {
  const { items, removeItem, clearCart } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/varukorg');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" aria-label="Visa kundvagn">
          <LuShoppingCart className="mr-2" /> Kundvagn
          {items.length > 0 && (
            <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-2">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 md:w-100">
        <h3 className="text-lg font-semibold mb-2">Din kundvagn</h3>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Din varukorg är tom.</p>
        ) : (
          <div className="space-y-3 max-h-128 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex items-start gap-3 border-b pb-3">
                <img
                  src={getTransformedImageUrl(item.imageUrl, 'w_100,h_100,c_fill')}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex flex-col flex-1">
                  <p className="font-semibold leading-tight">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × {item.price} kr
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Ta bort ${item.name}`}
                >
                  <FaTrash className="text-red-500" />
                </Button>
              </div>
            ))}
            <div className="pt-2">
              <p className="font-bold">Totalt: {total} kr</p>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={clearCart}>
                Töm kundvagn
              </Button>
              <Button variant="default" onClick={handleCheckout}>
                Gå till kassan
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Cart;
