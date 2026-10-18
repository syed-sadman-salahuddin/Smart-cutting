import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { menuGroups } from '../data/menuData';
import { currentUser } from '../data/user';
import '../styles/sidebar.css';

// Keeps only the menu items that match what was typed in the search box
function filterMenu(groups, query, t) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;

  return groups
    .map((group) => {
      const items = group.items
        .map((item) => {
          if (t(`sidebar.items.${item.label}`).toLowerCase().includes(q)) return item;
          if (item.children) {
            const children = item.children.filter((child) =>
              t(`sidebar.items.${child.label}`).toLowerCase().includes(q)
            );
            if (children.length) return { ...item, children };
          }
          return null;
        })
        .filter(Boolean);
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
}

// Ids of the expandable menus that contain the page we are currently on
function getActiveMenus(pathname) {
  const ids = [];
  menuGroups.forEach((group) =>
    group.items.forEach((item) => {
      if (item.children?.some((child) => child.path === pathname)) ids.push(item.id);
    })
  );
  return ids;
}

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [openMenus, setOpenMenus] = useState(() => getActiveMenus(pathname));

  // When the page changes: open the menu that owns it, and close the mobile sidebar
  useEffect(() => {
    setOpenMenus((prev) => [...new Set([...prev, ...getActiveMenus(pathname)])]);
    onCloseMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isSearching = query.trim() !== '';
  const visibleGroups = useMemo(() => filterMenu(menuGroups, query, t), [i18n.language, query, t]);

  const toggleMenu = (id) =>
    setOpenMenus((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <aside id="sidebar" className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      {/* round collapse button on the sidebar's right edge */}
      <button
        id="sidebarToggleBtn"
        className="sidebar-toggle"
        title={collapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
        onClick={onToggleCollapse}
      >
        <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`} />
      </button>

      {/* logo + name */}
      <div className="sidebar-brand">
        <Link to="/" className="brand-link">
          <div className="brand-logo">
            <i className="fa-solid fa-microchip" />
          </div>
          <span className="sidebar-text brand-name">{t('sidebar.brand')}</span>
        </Link>
        <button
          className="sidebar-close-mobile"
          onClick={onCloseMobile}
          aria-label={t('sidebar.closeSidebar')}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      {/* search */}
      <div className="sidebar-text sidebar-search">
        <div className="search-wrap">
          <span className="search-icon">
            <Search size={16} />
          </span>
          <input
            id="sidebarSearch"
            type="text"
            autoComplete="off"
            className="search-input"
            placeholder={t('sidebar.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label={t('sidebar.clearSearch')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* menu groups */}
      <nav className="sidebar-nav">
        <div className="nav-groups">
          {visibleGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="sidebar-text nav-group-title">
                <p>{t(`sidebar.groups.${group.title}`)}</p>
              </div>

              <div className="nav-items">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  // 1) simple link (Overview, Download History)
                  if (!item.children) {
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        end
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      >
                        <Icon size={18} className="nav-icon" />
                        <span className="sidebar-text nav-label">{t(`sidebar.items.${item.label}`)}</span>
                      </NavLink>
                    );
                  }

                  // 2) expandable menu with sub-links
                  const isOpen = isSearching || openMenus.includes(item.id);
                  return (
                    <div className="menu-group" key={item.id}>
                      <button
                        type="button"
                        className="nav-link"
                        aria-expanded={isOpen}
                        onClick={() => toggleMenu(item.id)}
                      >
                        <Icon size={18} className="nav-icon" />
                        <span className="sidebar-text nav-label">{t(`sidebar.items.${item.label}`)}</span>
                        <i className={`menu-arrow sidebar-text fa-solid fa-chevron-right${isOpen ? ' open' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="submenu sidebar-text">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) => `submenu-link${isActive ? ' active' : ''}`}
                            >
                              {t(`sidebar.items.${child.label}`)}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {visibleGroups.length === 0 && (
          <p className="sidebar-no-results">{t('sidebar.noResults')}</p>
        )}
      </nav>

      {/* logged-in user at the bottom */}
      <div className="sidebar-footer">
        <div className="profile-row">
          <div className="profile-avatar">
            <i className="fa-solid fa-shield-halved" />
          </div>
          <div className="sidebar-text profile-info">
            <p className="profile-name">
              {i18n.resolvedLanguage === 'bn' ? t('sidebar.profile.name') : currentUser.name}
            </p>
            <p className="profile-email">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}