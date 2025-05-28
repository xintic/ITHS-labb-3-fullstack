import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { ResetForm } from '@/components/ResetForm';
import { Button } from '@/components/ui/button';
import { LuUser } from 'react-icons/lu';

type Mode = 'login' | 'register' | 'reset';

type JwtPayload = {
  customer_id: number;
  email: string;
  role: 'admin' | 'customer';
  first_name: string;
  last_name: string;
};

const UserDialog = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get<JwtPayload>('/api/auth/user', {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401
      });
      if (res.status === 200) {
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
      } else {
        setFirstName(null);
        setLastName(null);
      }
    } catch (err) {
      console.error('Ett oväntat fel inträffade:', err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    const handleUpdate = () => fetchUser();
    window.addEventListener('user-updated', handleUpdate);
    return () => {
      window.removeEventListener('user-updated', handleUpdate);
    };
  }, [fetchUser]);

  const handleLoginSuccess = async () => {
    await fetchUser();
    setOpen(false);
  };

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setFirstName(null);
    setLastName(null);
  };

  return (
    <>
      {firstName ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" aria-label="Användarmenyn">
              <LuUser className="mr-2" />
              {firstName} {lastName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/anvandare')}>Mina sidor</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logga ut</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="ghost" onClick={() => setOpen(true)}>
            <LuUser className="mr-2" />
            Logga in
          </Button>
          <Dialog
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) setMode('login');
            }}
          >
            <DialogContent>
              <DialogTitle>
                {mode === 'login' && 'Logga in'}
                {mode === 'register' && 'Registrera konto'}
                {mode === 'reset' && 'Återställ lösenord'}
              </DialogTitle>
              <DialogDescription>
                {mode === 'login' && 'Fyll i din e-postadress och ditt lösenord för att logga in.'}
                {mode === 'register' && 'Skapa ett nytt konto genom att fylla i dina uppgifter.'}
                {mode === 'reset' && 'Ange din e-postadress för att återställa ditt lösenord.'}
              </DialogDescription>

              {mode === 'login' && <LoginForm onSwitch={setMode} onSuccess={handleLoginSuccess} />}
              {mode === 'register' && (
                <RegisterForm onBack={setMode} onSuccess={handleLoginSuccess} />
              )}
              {mode === 'reset' && <ResetForm onSwitch={setMode} />}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default UserDialog;
