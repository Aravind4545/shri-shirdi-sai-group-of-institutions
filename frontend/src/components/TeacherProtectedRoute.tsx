import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TeacherProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.user.role;
    const targetRoles = allowedRoles || ['Teacher', 'HOD', 'Admin', 'SuperAdmin'];
    if (!targetRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default TeacherProtectedRoute;
