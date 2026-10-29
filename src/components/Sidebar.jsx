import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { menuGroups } from '../data/menuData';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../styles/sidebar.css';

function filterMenu(groups, query, show) {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  const matches = (label) =>
    label.toLowerCase().includes(q) || show(label).toLowerCase().includes(q);

  return groups
    .map((group) => {
      const items = group.items
        .map((item) => {
          if (matches(item.label)) return item;
          if (item.children) {
            const children = item.children.filter((c) => matches(c.label));
            if (children.length) return { ...item, children };
          }
          return null;
        })
        .filter(Boolean);
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
}

function getActiveMenu(pathname) {
  const norm = pathname.replace(/\/+$/, '') || '/';
  return (
    menuGroups
      .flatMap((group) => group.items)
      .find((item) =>
        item.children?.some((child) => {
          const childNorm = child.path.replace(/\/+$/, '') || '/';
          return norm === childNorm || (childNorm !== '/' && norm.startsWith(`${childNorm}/`));
        })
      )?.id || null
  );
}

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const currentUser = useCurrentUser();
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState(() => getActiveMenu(pathname));

  const showItem = (label) => t(`sidebar.items.${label}`, { defaultValue: label });
  const showGroup = (title) => t(`sidebar.groups.${title}`, { defaultValue: title });

  useEffect(() => {
    setOpenMenu(getActiveMenu(pathname));
    onCloseMobile();
  }, [pathname]);

  const isSearching = query.trim() !== '';
  const visibleGroups = useMemo(
    () => filterMenu(menuGroups, query, showItem),
    [query, i18n.language]
  );

  useEffect(() => {
    if (!isSearching) {
      setOpenMenu(getActiveMenu(pathname));
      return;
    }

    const firstMatchingMenu = visibleGroups
      .flatMap((group) => group.items)
      .find((item) => item.children)?.id;
    setOpenMenu(firstMatchingMenu || null);
  }, [isSearching, pathname, visibleGroups]);

  const toggleMenu = (id) => setOpenMenu((previous) => (previous === id ? null : id));

  return (
    <aside id="sidebar" className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      {}
      <button
        id="sidebarToggleBtn"
        className="sidebar-toggle"
        title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
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
          <span className="sidebar-text brand-name">{t('sidebar.brand', { defaultValue: 'Smart Cutting' })}</span>
        </Link>
        <button className="sidebar-close-mobile" onClick={onCloseMobile} aria-label={t('sidebar.closeSidebar')}>
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
            placeholder={t('sidebar.searchPlaceholder', { defaultValue: 'Search menu...' })}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')} aria-label={t('sidebar.clearSearch')}>
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
                <p>{showGroup(group.title)}</p>
              </div>

              <div className="nav-items">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  if (!item.children) {
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        end
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                      >
                        <Icon size={18} className="nav-icon" />
                        <span className="sidebar-text nav-label">{showItem(item.label)}</span>
                      </NavLink>
                    );
                  }

                  const isOpen = openMenu === item.id;
                  return (
                    <div className="menu-group" key={item.id}>
                      <button
                        type="button"
                        className="nav-link"
                        aria-expanded={isOpen}
                        onClick={() => toggleMenu(item.id)}
                      >
                        <Icon size={18} className="nav-icon" />
                        <span className="sidebar-text nav-label">{showItem(item.label)}</span>
                        <i className={`menu-arrow sidebar-text fa-solid fa-chevron-right${isOpen ? ' open' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="submenu sidebar-text">
                          {item.children.map((child) => {
                            const normPath = pathname.replace(/\/+$/, '') || '/';
                            const normChildPath = child.path.replace(/\/+$/, '') || '/';
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                end
                                className={({ isActive }) => {
                                  const isCurrentOrSub =
                                    (isActive && normPath === normChildPath) ||
                                    (normChildPath !== '/' && normPath.startsWith(`${normChildPath}/`));
                                  return `submenu-link${isCurrentOrSub ? ' active' : ''}`;
                                }}
                              >
                                {showItem(child.label)}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {visibleGroups.length === 0 && <p className="sidebar-no-results">{t('sidebar.noResults')}</p>}
      </nav>

      <div className="sidebar-footer">
        <Link to="/superuser/" className="profile-row" title={currentUser.name}>
          <div className="profile-avatar">
            <i className="fa-solid fa-shield-halved" />
          </div>
          <div className="sidebar-text profile-info">
            <p className="profile-name">{currentUser.name}</p>
            <p className="profile-email">{currentUser.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}