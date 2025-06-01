// src/components/ProtectedRoute.tsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

interface Props {
  role?: 'admin';
}

const ProtectedRoute = ({ role }: Props) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/user', { withCredentials: true });
        if (!role || res.data.role === role) {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [role]);

  if (!authChecked) return <p className="p-6">Kontrollerar behörighet...</p>;
  if (!authorized) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
