import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Overview from './pages/Overview';
import PlaceholderPage from './pages/PlaceholderPage';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import DownloadHistory from './pages/DownloadHistory';
import { KEYS, readJSON } from './services/storage';
import { profileSeed } from './data/seedData';
import { menuGroups } from './data/menuData';

function getPageTitle(pathname) {
  const currentPath = pathname.replace(/\/+$/, '') || '/';

  if (currentPath === '/login') return 'ST Login';
  if (currentPath === '/') return 'ST Home';
  if (currentPath === '/superuser/edit' || currentPath === '/profile/edit') return 'ST Edit Profile';
  if (currentPath === '/superuser' || currentPath === '/profile') {
    const profile = readJSON(KEYS.profile, profileSeed);
    return `ST ${profile?.name || profileSeed.name}`;
  }

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
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/superuser/edit" element={<EditProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/superuser" element={<Profile />} />
            <Route path="/superuser/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/" element={<Settings />} />
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/settings/change-password/" element={<ChangePassword />} />
            <Route path="/download" element={<DownloadHistory />} />
            <Route path="/download/" element={<DownloadHistory />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}