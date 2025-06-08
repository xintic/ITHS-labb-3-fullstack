import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const shippingLabels: Record<string, string> = {
  budbee: 'Budbee Hemleverans',
  best: 'Best Transport',
  airmee: 'Airmee Hemleverans',
  postnord_ombud: 'Postnord Ombud',
  postnord_home: 'Postnord Hemleverans'
};

const paymentLabels: Record<string, string> = {
  card: 'Kortbetalning',
  swish: 'Swish',
  invoice: 'Faktura'
};

interface OrderItem {
  product_id: number;
  name: string;
  image_url: string;
  unit_price: number;
  quantity: number;
}

interface OrderData {
  order_id: number;
  items: OrderItem[];
  total_price: number;
  shipping_method: string;
  payment_method: string;
  created_at: string;
}

const ConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`, { withCredentials: true });
        setOrder(res.data);
      } catch (error) {
        console.error('Kunde inte hämta orderdata:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Laddar orderinformation...</p>;

  if (!order) return <p className="text-center mt-10">Kunde inte hitta ordern.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Tack för din beställning!</h1>
        <p className="text-muted-foreground mt-2">
          Din orderbekräftelse skickas till din e-postadress.
        </p>
      </div>

      <div className="border rounded-md p-4">
        <h2 className="text-xl font-semibold mb-4">Order #{order.order_id}</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Beställd: {new Date(order.created_at).toLocaleString()}
        </p>
        <p className="text-sm">
          Leverans: {shippingLabels[order.shipping_method] || order.shipping_method}
        </p>
        <p className="text-sm">
          Betalning: {paymentLabels[order.payment_method] || order.payment_method}
        </p>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-4 border-b pb-2 last:border-none"
          >
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.quantity} × {item.unit_price} kr
              </p>
            </div>
            <p className="font-semibold">{item.quantity * item.unit_price} kr</p>
          </div>
        ))}
      </div>

      <div className="text-right text-lg font-bold">Totalt: {order.total_price} kr</div>

      <div className="text-center mt-6">
        <Button asChild>
          <Link to="/">Till startsidan</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
