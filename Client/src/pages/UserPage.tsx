import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Min profil</h1>
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
          <Input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} />
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
        <Button type="submit">Spara ändringar</Button>
        {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default UserPage;
