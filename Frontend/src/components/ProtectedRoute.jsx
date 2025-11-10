import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectUser, selectIsAuthenticated } from '@/store/auth/authSlice';

const ProtectedRoute = ({ children, requireAdmin = false, requirePharmacist = false }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    
    const isAdmin = user?.role === 'ADMIN';
    const isPharmacist = user?.role === 'PHARMACIST';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    // Si requiere admin, solo permitir ADMIN
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace/>;
    }

    // Si requiere farmacéutico, permitir PHARMACIST o ADMIN
    if (requirePharmacist && !isPharmacist && !isAdmin) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
