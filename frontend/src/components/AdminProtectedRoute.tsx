import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    fetch('http://localhost:5001/api/auth/me', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.role === 'Admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => setIsAdmin(false));
  }, [token]);

  if (isAdmin === null) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Verifying Access...</div>;
  if (isAdmin === false) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default AdminProtectedRoute;
