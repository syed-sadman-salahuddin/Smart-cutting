import { useLocation } from 'react-router-dom';

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  return (
    <div className="page-card">
      
    </div>
  );
}