import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gray-50)' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role, redirect to appropriate home
    if (user.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/patient/chat" replace />;
  }

  return <Outlet />;
}
