import { useLocation } from 'react-router-dom';

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  return (
    <div className="page-card">
      <h1>Coming soon</h1>
      <p>The page for <code>{pathname}</code> has not been built yet.</p>
    </div>
  );
}