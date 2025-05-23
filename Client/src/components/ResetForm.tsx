import { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  onSwitch: (mode: 'login' | 'register' | 'reset') => void;
};

export const ResetForm = ({ onSwitch }: Props) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.put('/api/auth/reset-password', { email, newPassword });
      setSuccess(true);
      setTimeout(() => onSwitch('login'), 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || 'Fel vid återställning.');
      } else {
        setError('Ett oväntat fel inträffade.');
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
        <Label htmlFor="newPassword">Nytt lösenord</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">Lösenord uppdaterat!</p>}

      <Button type="submit" className="w-full">
        Återställ lösenord
      </Button>

      <div className="text-center text-sm">
        <button type="button" onClick={() => onSwitch('login')} className="text-blue-500 underline">
          Tillbaka till inloggning
        </button>
      </div>
    </form>
  );
};
