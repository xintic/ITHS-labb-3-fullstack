import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getTransformedImageUrl } from '@/utils/cloudinary';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

const CheckoutPage = () => {
  const { items: cartItems } = useCartStore();
  const [openSection, setOpenSection] = useState<'cart' | 'shipping' | 'payment'>('cart');

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const goTo = (step: typeof openSection) => setOpenSection(step);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border rounded-md">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
          onClick={() => goTo('cart')}
        >
          <h2 className="text-xl font-bold">Din varukorg</h2>
          {openSection === 'cart' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'cart' && (
          <div className="p-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">Varukorgen är tom.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 border-b py-2">
                    <img
                      src={getTransformedImageUrl(item.imageUrl, 'w_100,h_100,c_fill')}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.price} kr
                      </p>
                    </div>
                    <p className="font-semibold">{item.quantity * item.price} kr</p>
                  </div>
                ))}

                <div className="text-right font-bold text-lg">Totalt: {total} kr</div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => goTo('shipping')}>Gå vidare till leverans</Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
          onClick={() => goTo('shipping')}
        >
          <h2 className="text-xl font-bold">Välj leveransalternativ</h2>
          {openSection === 'shipping' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'shipping' && (
          <div className="p-4 space-y-3">
            <p>Postnord - 49 kr</p>
            <p>Hämta i butik - 0 kr</p>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => goTo('cart')}>
                Tillbaka till varukorg
              </Button>
              <Button onClick={() => goTo('payment')}>Gå vidare till betalning</Button>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
          onClick={() => goTo('payment')}
        >
          <h2 className="text-xl font-bold">Välj betalningsmetod</h2>
          {openSection === 'payment' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'payment' && (
          <div className="p-4 space-y-3">
            <p>Kort</p>
            <p>Swish</p>
            <p>Faktura</p>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => goTo('shipping')}>
                Tillbaka till leverans
              </Button>
              <Button>Slutför köp</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
