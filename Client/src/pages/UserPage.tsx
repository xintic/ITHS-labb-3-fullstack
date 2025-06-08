import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProgressBar from '@/components/ProgressBar';

type Order = {
  order_id: string;
  order_date: string;
  total_amount: number;
  shipping_method: string;
  payment_method: string;
  status: string;
};

type OrderItem = {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
};

type OrderDetail = {
  order_id: string;
  customer_id: string;
  created_at: string;
  total_price: number;
  shipping_method: string;
  payment_method: string;
  items: OrderItem[];
};

const shippingLabels: Record<string, string> = {
  budbee: 'Budbee',
  best: 'Best Transport',
  airmee: 'Airmee',
  postnord_ombud: 'Postnord Ombud',
  postnord_home: 'Postnord Hem'
};

const paymentLabels: Record<string, string> = {
  card: 'Kort',
  swish: 'Swish',
  invoice: 'Faktura'
};

const UserPage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    care_of: '',
    postal_code: '',
    city: '',
    door_code: ''
  });
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderDetail>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('/api/auth/user', { withCredentials: true })
      .then((res) => {
        const { first_name, last_name, phone, address, care_of, postal_code, city, door_code } =
          res.data;

        setForm({
          first_name: first_name || '',
          last_name: last_name || '',
          phone: phone || '',
          address: address || '',
          care_of: care_of || '',
          postal_code: postal_code || '',
          city: city || '',
          door_code: door_code || ''
        });
      })
      .catch((err) => {
        console.error('Kunde inte hämta användarinfo:', err);
      });
  }, []);

  useEffect(() => {
    setLoadingOrders(true);
    axios
      .get('/api/orders/me', { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error('Kunde inte hämta ordrar:', err);
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  const fetchOrderDetail = async (order_id: string) => {
    if (orderDetails[order_id]) {
      setOpenOrder(openOrder === order_id ? null : order_id); // toggla
      return;
    }
    setLoadingDetail(order_id);
    try {
      const res = await axios.get(`/api/orders/${order_id}`, { withCredentials: true });
      setOrderDetails((prev) => ({ ...prev, [order_id]: res.data }));
      setOpenOrder(order_id);
    } catch (err) {
      console.error('Kunde inte hämta orderdetaljer:', err);
    } finally {
      setLoadingDetail(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/customers/user', form, { withCredentials: true });
      await axios.put('/api/auth/refresh-token', {}, { withCredentials: true });
      window.dispatchEvent(new Event('user-updated'));
      setMessage('Profilen uppdaterad.');
    } catch (err) {
      console.error('Kunde inte uppdatera profil:', err);
      setMessage('Ett fel uppstod vid uppdatering.');
    }
  };

  return (
    <div className="px-4 py-4 md:px-8 lg:px-16 xl:px-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="bg-white border rounded-md shadow p-6 md:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Min profil</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                Förnamn
              </label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                value={form.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                Efternamn
              </label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Mobilnummer
              </label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Adress
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="care_of" className="block text-sm font-medium mb-1">
                C/O (valfritt)
              </label>
              <Input
                id="care_of"
                name="care_of"
                type="text"
                value={form.care_of}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium mb-1">
                Postnummer
              </label>
              <Input
                id="postal_code"
                name="postal_code"
                type="text"
                value={form.postal_code}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                Ort
              </label>
              <Input id="city" name="city" type="text" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="door_code" className="block text-sm font-medium mb-1">
                Portkod (valfritt)
              </label>
              <Input
                id="door_code"
                name="door_code"
                type="text"
                value={form.door_code}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Spara ändringar
            </Button>
            {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
          </form>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white border rounded-md shadow p-6">
            <h2 className="text-2xl font-semibold mb-3">Mina ordrar</h2>
            {loadingOrders ? (
              <p>Laddar ordrar...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground">Du har inga ordrar ännu.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.order_id} className="border rounded-md p-4 flex flex-col gap-2">
                    <div className="flex-1 md:flex md:items-center md:justify-between md:space-x-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="font-medium">Ordernummer:</span>{' '}
                          <span>{String(order.order_id).slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="font-medium">Datum:</span>{' '}
                          {new Date(order.order_date).toLocaleDateString('sv-SE')}
                        </div>
                        <div>
                          <span className="font-medium">Summa:</span> {order.total_amount} kr
                        </div>
                        <div>
                          <span className="font-medium">Frakt:</span>{' '}
                          {shippingLabels[order.shipping_method] || order.shipping_method}
                        </div>
                        <div>
                          <span className="font-medium">Betalning:</span>{' '}
                          {paymentLabels[order.payment_method] || order.payment_method}
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0 md:ml-4">
                        <Button
                          size="sm"
                          onClick={() => fetchOrderDetail(order.order_id)}
                          disabled={loadingDetail === order.order_id}
                        >
                          {openOrder === order.order_id ? 'Dölj detaljer' : 'Visa detaljer'}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ProgressBar
                        status={order.status}
                        className="mt-2 md:mt-0 w-full md:w-auto"
                      />
                    </div>
                    {openOrder === order.order_id && (
                      <div className="mt-4 w-full border-t pt-3">
                        {loadingDetail === order.order_id ? (
                          <p>Laddar detaljer...</p>
                        ) : orderDetails[order.order_id] ? (
                          <div>
                            <h3 className="font-semibold mb-2">Produkter i ordern</h3>
                            <div className="flex flex-col gap-2">
                              {orderDetails[order.order_id].items.map((item) => (
                                <div key={item.product_id} className="flex gap-3 items-center">
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded border"
                                  />
                                  <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-700">
                                      {item.quantity} × {item.unit_price} kr
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p>Kunde inte ladda orderdetaljer.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
