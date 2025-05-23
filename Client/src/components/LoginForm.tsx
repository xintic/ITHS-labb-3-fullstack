import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  onSwitch: (mode: 'login' | 'register' | 'reset') => void;
  onSuccess?: () => void;
};

export const LoginForm = ({ onSwitch, onSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Fel vid inloggning.');
      } else {
        setError('Något gick fel.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="email">E-post</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="password">Lösenord</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full">
        Logga in
      </Button>

      <div className="text-center text-sm mt-2">
        <button type="button" onClick={() => onSwitch('reset')} className="text-blue-500 underline">
          Glömt lösenord?
        </button>
      </div>

      <div className="text-center text-sm">
        Inget konto?{' '}
        <button
          type="button"
          onClick={() => onSwitch('register')}
          className="text-blue-500 underline"
        >
          Skapa ett
        </button>
      </div>
    </form>
  );
};
