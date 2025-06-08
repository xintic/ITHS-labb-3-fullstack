import { useEffect, useState } from 'react';
import axios from 'axios';
import slugify from 'slugify';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import AdminProductCard from '@/components/AdminProductCard';

const orderSteps = ['Registrerad', 'Behandlas', 'Skickad', 'Mottagen'] as const;
type OrderStatus = (typeof orderSteps)[number];

interface Order {
  order_id: string;
  order_date: string;
  total_amount: number;
  shipping_method: string;
  payment_method: string;
  status: OrderStatus;
  customer_id: number;
}

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  slug: string;
}

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

const uploadToCloudinary = async (file: File, slug: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'petly_unsigned_upload');
  formData.append('public_id', slug);
  const res = await axios.post('https://api.cloudinary.com/v1_1/dtsmij02l/image/upload', formData);
  return res.data.secure_url;
};

export default function AdminPanelPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [categories, setCategories] = useState<{ category_id: number; name: string }[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderMessage, setOrderMessage] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders', { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      setOrderMessage('Kunde inte hämta ordrar.');
      console.error('Kunde inte hämta ordrar:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/auth/user', { withCredentials: true });
        setIsAdmin(userRes.data.role === 'admin');
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthChecked(true);
      }
      try {
        const productsRes = await axios.get('/api/products');
        setProducts(productsRes.data);
      } catch (err) {
        console.error('Kunde inte hämta produkter:', err);
      }
      try {
        const categoriesRes = await axios.get('/api/products/categories');
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Kunde inte hämta kategorier:', err);
      }
      fetchOrders();
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    const slug = slugify(name, { lower: true, strict: true });
    setLoading(true);
    setMessage('');
    try {
      const imageUrl = await uploadToCloudinary(image, slug);
      await axios.post(
        '/api/admin/products',
        {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          image_url: imageUrl,
          category_id: parseInt(categoryId)
        },
        { withCredentials: true }
      );
      setMessage('Produkten har skapats!');
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategoryId('');
      setImage(null);
      fetchProducts();
    } catch (err) {
      console.error('Fel vid skapande av produkt', err);
      setMessage('Kunde inte skapa produkt.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/admin/products/${id}`, {
        withCredentials: true
      });
      fetchProducts();
    } catch (err) {
      console.error('Fel vid borttagning av produkt', err);
    }
  };

  const handleDeleteOrder = async (order_id: string) => {
    try {
      await axios.delete(`/api/admin/orders/${order_id}`, { withCredentials: true });
      fetchOrders();
      setOrderMessage('Ordern har tagits bort.');
    } catch (err) {
      setOrderMessage('Kunde inte ta bort order.');
      console.error('Kunde inte ta bort order:', err);
    }
  };

  const updateOrderStatus = async (order_id: string, newStatus: OrderStatus) => {
    try {
      await axios.put(
        `/api/admin/orders/${order_id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders();
      setOrderMessage('Orderstatus uppdaterad!');
    } catch (err) {
      setOrderMessage('Kunde inte uppdatera orderstatus.');
      console.error('Kunde inte hämta orderstatus:', err);
    }
  };

  if (!authChecked) return <p className="p-6">Laddar...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Adminpanel</h1>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Alla ordrar</h2>
        {orderMessage && <p className="text-sm mb-3 text-green-600">{orderMessage}</p>}
        {orders.length === 0 ? (
          <p className="text-muted-foreground">Det finns inga ordrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded shadow bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Ordernr</th>
                  <th className="p-2 text-left">Datum</th>
                  <th className="p-2 text-left">Summa</th>
                  <th className="p-2 text-left">Kund-id</th>
                  <th className="p-2 text-left">Frakt</th>
                  <th className="p-2 text-left">Betalning</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="border-t">
                    <td className="p-2">{String(order.order_id).slice(0, 8).toUpperCase()}</td>
                    <td className="p-2">
                      {new Date(order.order_date).toLocaleDateString('sv-SE')}
                    </td>
                    <td className="p-2">{order.total_amount} kr</td>
                    <td className="p-2">{order.customer_id}</td>
                    <td className="p-2">
                      {shippingLabels[order.shipping_method] || order.shipping_method}
                    </td>
                    <td className="p-2">
                      {paymentLabels[order.payment_method] || order.payment_method}
                    </td>
                    <td className="p-2">
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          updateOrderStatus(order.order_id, val as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Välj status" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderSteps.map((step) => (
                            <SelectItem key={step} value={step}>
                              {step}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <AlertDialog
                        open={orderToDelete?.order_id === order.order_id}
                        onOpenChange={(open) => {
                          if (!open) setOrderToDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setOrderToDelete(order)}
                          >
                            Ta bort
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ta bort order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Är du säker på att du vill ta bort order{' '}
                              <span className="font-mono">
                                {String(order.order_id).slice(0, 8).toUpperCase()}
                              </span>
                              ? Denna åtgärd går inte att ångra.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
                              Avbryt
                            </AlertDialogCancel>
                            <AlertDialogAction
                              disabled={deleting}
                              onClick={async () => {
                                setDeleting(true);
                                await handleDeleteOrder(order.order_id);
                                setOrderToDelete(null);
                                setDeleting(false);
                              }}
                            >
                              {deleting ? 'Tar bort...' : 'Ta bort'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">Lägg till ny produkt</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input placeholder="Namn" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
        <Input
          placeholder="Pris"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          placeholder="Lagerantal"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <Select value={categoryId} onValueChange={(value) => setCategoryId(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Välj kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Laddar upp...' : 'Skapa produkt'}
        </Button>
        {message && <p className="text-sm text-center text-gray-600 mt-2">{message}</p>}
      </form>

      <h2 className="text-xl font-semibold mb-2">Existerande produkter</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <AdminProductCard
            key={p.product_id}
            productId={p.product_id}
            name={p.name}
            price={p.price}
            stock={p.stock}
            imageUrl={p.image_url}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
