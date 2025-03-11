import { Navigate, Outlet } from 'react-router-dom';
import authState from '@/state/auth';
import { useSignal } from "@preact/signals-react";

export default function ProtectedRoutes() {
  const authS = useSignal(authState);


  if (!authS.value.value.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
