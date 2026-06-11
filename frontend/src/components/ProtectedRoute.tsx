import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Ideally, we'd redirect them to the specific login page they came from,
    // but without state, we can redirect to the generic landing page or a unified login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
