import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import '../styles/layout.css';

const COLLAPSE_KEY = 'st-sidebar-collapsed';

export default function Layout() {
  // collapsed = desktop mini sidebar, mobileOpen = slide-in sidebar on small screens
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, prev ? '0' : '1');
      } catch {
        /* ignore */
      }
      return !prev;
    });
  };

  return (
    <div className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={toggleCollapsed}
        onCloseMobile={() => setMobileOpen(false)}
      />
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <Header onOpenMobileSidebar={() => setMobileOpen(true)} />

      <main id="mainContent" className="main-content">
        <div className="main-inner">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}