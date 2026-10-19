import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu, Palette, Languages, Moon, Sun, Maximize, Minimize, ChevronDown,
  Check, Sparkles, RotateCcw, User, Settings, FileDown, LogOut,
} from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  COLOR_THEMES, ROUNDED_CATEGORIES, ROUNDED_OPTIONS, DEFAULT_APPEARANCE,
  loadAppearance, saveAppearance, applyAppearance,
} from '../utils/theme';
import '../styles/header.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা' },
];

export default function Header({ onOpenMobileSidebar }) {
  const currentUser = useCurrentUser();
  const { t, i18n } = useTranslation();
  // which dropdown is open: 'appearance' | 'language' | 'notifications' | 'user' | null
  const [openMenu, setOpenMenu] = useState(null);
  const [appearance, setAppearance] = useState(loadAppearance);
  const [appearanceTab, setAppearanceTab] = useState('color');
  const [roundedCategory, setRoundedCategory] = useState('button');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // the active language comes from i18next (saved in localStorage by translations/i18n.js)
  const language = i18n.language?.startsWith('bn') ? 'bn' : 'en';

  const toggleMenu = (name) => setOpenMenu((cur) => (cur === name ? null : name));

  // Apply + remember colour / dark mode / roundness whenever they change
  useEffect(() => {
    applyAppearance(appearance);
    saveAppearance(appearance);
  }, [appearance]);

  // Close dropdowns when clicking outside or pressing Esc
  useEffect(() => {
    const onMouseDown = (e) => {
      if (!e.target.closest('[data-menu-root]')) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Keep the fullscreen icon in sync (also when the user presses Esc / F11)
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  // switches the whole app language (i18next also saves it)
  const chooseLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpenMenu(null);
  };

  const isDark = appearance.mode === 'dark';

  return (
    <header id="header" className="header">
      <button className="icon-btn mobile-menu-btn" onClick={onOpenMobileSidebar} aria-label={t('header.openSidebar')}>
        <Menu size={18} />
      </button>

      <div className="header-actions">
        {/* ---------- Appearance (palette) ---------- */}
        <div className="menu-root" data-menu-root>
          <button className="icon-btn" title={t('header.appearance')} onClick={() => toggleMenu('appearance')}>
            <Palette size={18} />
            <span className="appearance-dot" />
          </button>

          {openMenu === 'appearance' && (
            <div className="dropdown dropdown-deep dropdown-wide">
              <div className="ap-head">
                <div>
                  <div className="ap-title">
                    <Sparkles size={12} className="ap-sparkle" />
                    <h3>{t('appearance.title')}</h3>
                  </div>
                  <p>{t('appearance.subtitle')}</p>
                </div>
                <button
                  className="ap-reset"
                  title={t('appearance.reset')}
                  onClick={() => setAppearance((a) => ({ ...DEFAULT_APPEARANCE, mode: a.mode }))}
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <div className="ap-tabs-wrap">
                <div className="ap-tabs">
                  <button
                    className={`ap-tab${appearanceTab === 'color' ? ' active' : ''}`}
                    onClick={() => setAppearanceTab('color')}
                  >
                    {t('appearance.tabColor')}
                  </button>
                  <button
                    className={`ap-tab${appearanceTab === 'rounded' ? ' active' : ''}`}
                    onClick={() => setAppearanceTab('rounded')}
                  >
                    {t('appearance.tabRounded')}
                  </button>
                </div>
              </div>
              <div className="ap-divider" />

              {appearanceTab === 'color' ? (
                <div className="ap-panel">
                  <div className="ap-grid">
                    {COLOR_THEMES.map((theme) => {
                      const selected = appearance.color === theme.id;
                      const p = theme.primary.join(', ');
                      const s = theme.secondary.join(', ');
                      return (
                        <button
                          key={theme.id}
                          className={`ap-option${selected ? ' selected' : ''}`}
                          onClick={() => setAppearance((a) => ({ ...a, color: theme.id }))}
                        >
                          <div className="ap-swatch" style={{ background: `linear-gradient(135deg, rgb(${p}) 0%, rgb(${s}) 100%)` }} />
                          <span className="ap-label">{t(`appearance.themes.${theme.id}`, { defaultValue: theme.name })}</span>
                          {selected && (
                            <div className="ap-check" style={{ background: `rgb(${p})` }}>
                              <Check size={10} color="#fff" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="ap-panel">
                  <div className="ap-tabs ap-tabs-spaced">
                    {ROUNDED_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        className={`ap-tab${roundedCategory === cat.id ? ' active' : ''}`}
                        onClick={() => setRoundedCategory(cat.id)}
                      >
                        {t(`appearance.categories.${cat.id}`, { defaultValue: cat.label })}
                      </button>
                    ))}
                  </div>
                  <div className="ap-grid">
                    {ROUNDED_OPTIONS.map((opt) => {
                      const selected = appearance.rounded[roundedCategory] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          className={`ap-option ap-option-col${selected ? ' selected' : ''}`}
                          onClick={() =>
                            setAppearance((a) => ({ ...a, rounded: { ...a.rounded, [roundedCategory]: opt.id } }))
                          }
                        >
                          <div className="ap-rounded-preview" style={{ borderRadius: opt.value }} />
                          <span className="ap-label">{t(`appearance.rounded.${opt.id}`, { defaultValue: opt.label })}</span>
                          {selected && (
                            <div className="ap-check ap-check-neutral">
                              <Check size={10} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ---------- Language ---------- */}
        <div className="menu-root" data-menu-root>
          <button className="icon-btn" title={t('header.language')} onClick={() => toggleMenu('language')}>
            <Languages size={18} />
          </button>
          {openMenu === 'language' && (
            <div className="dropdown dropdown-deep dropdown-small">
              <div className="menu-list">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`menu-item menu-item-between${language === lang.code ? ' selected' : ''}`}
                    onClick={() => chooseLanguage(lang.code)}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Dark / light ---------- */}
        <button
          className="icon-btn"
          title={t('header.toggleTheme')}
          onClick={() => setAppearance((a) => ({ ...a, mode: a.mode === 'dark' ? 'light' : 'dark' }))}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* ---------- Fullscreen ---------- */}
        <button className="icon-btn" title={t('header.toggleFullscreen')} onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>

        {/* ---------- Notifications ---------- */}
        <div className="menu-root" data-menu-root>
          <button className="icon-btn" title={t('header.notifications')} onClick={() => toggleMenu('notifications')}>
            <i className="fa-solid fa-bell" />
          </button>
          {openMenu === 'notifications' && (
            <div className="dropdown dropdown-wide">
              <div className="notif-head">
                <h3>{t('notifications.title')}</h3>
                <p>{t('notifications.unread', { count: 0 })}</p>
              </div>
              <div className="notif-empty">{t('notifications.empty')}</div>
              <div className="notif-foot">
                <Link to="/notifications/" onClick={() => setOpenMenu(null)}>{t('notifications.viewAll')}</Link>
              </div>
            </div>
          )}
        </div>

        <div className="header-divider" />

        {/* ---------- User ---------- */}
        <div className="menu-root" data-menu-root>
          <button className="user-btn" onClick={() => toggleMenu('user')}>
            <div className="user-avatar">
              <span>{currentUser.initial}</span>
            </div>
            <div className="user-text">
              <p className="user-name">{currentUser.name}</p>
              <p className="user-email">{currentUser.email}</p>
            </div>
            <ChevronDown size={14} className="user-chevron" />
          </button>

          {openMenu === 'user' && (
            <div className="dropdown dropdown-user">
              <div className="user-menu-head">
                <p className="um-name">{currentUser.name}</p>
                <p className="um-email">{currentUser.email}</p>
              </div>
              <div className="menu-list">
                <Link to="/superuser/" className="menu-item" onClick={() => setOpenMenu(null)}>
                  <User size={16} /> {t('header.profile')}
                </Link>
                <Link to="/settings/" className="menu-item" onClick={() => setOpenMenu(null)}>
                  <Settings size={16} /> {t('header.settings')}
                </Link>
                <Link to="/download/" className="menu-item" onClick={() => setOpenMenu(null)}>
                  <FileDown size={16} /> {t('header.download')}
                </Link>
                <div className="menu-sep" />
                <Link to="/logout/" className="menu-item menu-item-danger" onClick={() => setOpenMenu(null)}>
                  <LogOut size={16} /> {t('header.logout')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}