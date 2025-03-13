import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authState from '@/state/auth';
import { useSignal } from "@preact/signals-react";

export default function ProtectedRoutes() {
  const authS = useSignal(authState.value);
  const location = useLocation();

  if (!authS.value.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
