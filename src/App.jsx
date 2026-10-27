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
import Notifications from './pages/Notifications';
import Parts from './pages/Parts';
import Colors from './pages/Colors';
import Sizes from './pages/Sizes';
import PurchaseOrders from './pages/PurchaseOrders';
import OurReference from './pages/OurReference';
import Buyer from './pages/Buyer';
import FabricShades from './pages/FabricShades';
import Groups from './pages/Groups';
import CuttingPO from './pages/CuttingPO';
import CuttingPOCreate from './pages/CuttingPOCreate';
import BundleCardSinglePOCreate from './pages/BundleCardSinglePOCreate';
import { KEYS, readJSON } from './services/storage';
import { profileSeed } from './data/seedData';
import { menuGroups } from './data/menuData';

function getPageTitle(pathname) {
  const currentPath = pathname.replace(/\/+$/, '') || '/';

  if (currentPath === '/login') return 'ST Login';
  if (currentPath === '/') return 'ST Home';
  if (currentPath === '/general/part') return 'ST Cutting Parts';
  if (currentPath === '/general/shade') return 'ST Fabric Shades';
  if (currentPath === '/general/group') return 'ST Cutting Ratio Groups';
  if (currentPath === '/cutting/po') return 'ST Cutting POs';
  if (currentPath === '/cutting/po/create') return 'ST Create Cutting PO';
  if (currentPath === '/cutting/bundle-card/single-po/create') return 'ST Bundle Card';
  if (currentPath === '/notifications') return 'ST Notifications';
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
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/" element={<Notifications />} />
            <Route path="/general/part" element={<Parts />} />
            <Route path="/general/part/" element={<Parts />} />
            <Route path="/general/shade" element={<FabricShades />} />
            <Route path="/general/shade/" element={<FabricShades />} />
            <Route path="/general/group" element={<Groups />} />
            <Route path="/general/group/" element={<Groups />} />
            <Route path="/po/size" element={<Sizes />} />
            <Route path="/po/size/" element={<Sizes />} />
            <Route path="/po/color" element={<Colors />} />
            <Route path="/po/color/" element={<Colors />} />
            <Route path="/po/purchase-order" element={<PurchaseOrders />} />
            <Route path="/po/purchase-order/" element={<PurchaseOrders />} />
            <Route path="/po/our-reference" element={<OurReference />} />
            <Route path="/po/our-reference/" element={<OurReference />} />
            <Route path="/po/buyer" element={<Buyer />} />
            <Route path="/po/buyer/" element={<Buyer />} />
            <Route path="/cutting/po" element={<CuttingPO />} />
            <Route path="/cutting/po/" element={<CuttingPO />} />
            <Route path="/cutting/po/create" element={<CuttingPOCreate />} />
            <Route path="/cutting/po/create/" element={<CuttingPOCreate />} />
            <Route path="/cutting/bundle-card" element={<BundleCardSinglePOCreate />} />
            <Route path="/cutting/bundle-card/" element={<BundleCardSinglePOCreate />} />
            <Route path="/cutting/bundle-card/single-po/create" element={<BundleCardSinglePOCreate />} />
            <Route path="/cutting/bundle-card/single-po/create/" element={<BundleCardSinglePOCreate />} />
            <Route path="*" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}