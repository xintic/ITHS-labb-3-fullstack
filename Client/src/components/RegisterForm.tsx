import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  onBack: (mode: 'login' | 'register' | 'reset') => void;
  onSuccess?: () => void;
};

export const RegisterForm = ({ onBack, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/api/auth/register', formData, { withCredentials: true });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Något gick fel.');
      } else {
        setError('Ett okänt fel inträffade.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Förnamn</Label>
        <Input
          name="first_name"
          autoComplete="given-name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Efternamn</Label>
        <Input
          name="last_name"
          autoComplete="family-name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>E-post</Label>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Lösenord</Label>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full">
        Skapa konto
      </Button>
      <p className="text-sm text-center mt-2">
        Har du redan ett konto?{' '}
        <button type="button" onClick={() => onBack('login')} className="underline text-blue-500">
          Logga in
        </button>
      </p>
    </form>
  );
};
