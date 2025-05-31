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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import AdminProductCard from '@/components/AdminProductCard';

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

const uploadToCloudinary = async (file: File, slug: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'petly_unsigned_upload');
  formData.append('public_id', slug);

  const res = await axios.post('https://api.cloudinary.com/v1_1/dtsmij02l/image/upload', formData);
  return res.data.secure_url;
};

export default function AdminProductPanel() {
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

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
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

  if (!authChecked) return <p className="p-6">Laddar...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lägg till ny produkt</h1>
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
