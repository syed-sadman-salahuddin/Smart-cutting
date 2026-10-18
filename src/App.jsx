import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Overview from './pages/Overview';
import PlaceholderPage from './pages/PlaceholderPage';
import { menuGroups } from './data/menuData';

function getPageTitle(pathname) {
  const currentPath = pathname.replace(/\/+$/, '') || '/';

  if (currentPath === '/login') return 'ST Login';
  if (currentPath === '/') return 'ST Home';

  const menuItem = menuGroups
    .flatMap((group) => group.items)
    .flatMap((item) => (item.children ? item.children : [item]))
    .find((item) => item.path && (item.path.replace(/\/+$/, '') || '/') === currentPath);

  const pageName =
    menuItem?.label ||
    currentPath
      .split('/')
      .filter(Boolean)
      .pop()
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase());

  return `ST ${pageName}`;
}

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <Routes>
        {/* pages anyone can open */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* pages that need a login: not signed in -> sent to /login/ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            {/* every other menu link shows a placeholder until we build it */}
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}