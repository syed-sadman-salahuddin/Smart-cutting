import { Navigate } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function Logout() {
  logout();
  return <Navigate to="/login/" replace />;
}