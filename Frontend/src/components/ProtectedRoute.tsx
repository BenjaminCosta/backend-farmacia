import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePharmacist?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requirePharmacist = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isPharmacist } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin, solo permitir ADMIN
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si requiere farmacéutico, permitir PHARMACIST o ADMIN
  if (requirePharmacist && !isPharmacist && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
