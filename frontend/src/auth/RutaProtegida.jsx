import { Navigate, Outlet } from 'react-router-dom';
import { obtenerAccessToken } from '../api/client';


export default function RutaProtegida() {
  if (!obtenerAccessToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}