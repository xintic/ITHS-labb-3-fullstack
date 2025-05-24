import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { ResetForm } from '@/components/ResetForm';
import { Button } from '@/components/ui/button';
import { LuCircleUserRound } from 'react-icons/lu';
import axios from 'axios';

type Mode = 'login' | 'register' | 'reset';

type JwtPayload = {
  customer_id: number;
  email: string;
  role: 'admin' | 'customer';
  first_name: string;
};

const UserDialog = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<JwtPayload>('/api/auth/user', {
          withCredentials: true,
          validateStatus: (status) => status === 200 || status === 401
        });
        if (res.status === 200) {
          setFirstName(res.data.first_name);
        } else {
          setFirstName(null);
        }
      } catch (err) {
        console.error('Ett oväntat fel inträffade:', err);
      }
    };
    if (open) fetchUser();
  }, [open]);

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setFirstName(null);
    setOpen(false);
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        <LuCircleUserRound className="mr-2" />
        {firstName ? firstName : 'Logga in'}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen && !firstName) {
            setMode('login');
          }
        }}
      >
        <DialogContent>
          {firstName ? (
            <div className="space-y-4 text-center">
              <p>
                <strong>{firstName}</strong>
              </p>
              <Button variant="outline" onClick={handleLogout}>
                Logga ut
              </Button>
            </div>
          ) : (
            <>
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
              {mode === 'login' && (
                <LoginForm onSwitch={setMode} onSuccess={() => setOpen(false)} />
              )}
              {mode === 'register' && (
                <RegisterForm onBack={setMode} onSuccess={() => setOpen(false)} />
              )}
              {mode === 'reset' && <ResetForm onSwitch={setMode} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDialog;
