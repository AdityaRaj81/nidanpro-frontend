import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminGuard({ children }) {
  const { staffAuth } = useAuth();
  const role = staffAuth?.role?.toUpperCase();

  if (!staffAuth) {
    return <Navigate to="/auth/super-admin-login" replace />;
  }

  if (role !== 'SUPER_ADMIN') {
    return <Navigate to={role === 'ADMIN' ? '/lab-admin/dashboard' : '/staff/dashboard'} replace />;
  }

  return children;
}
