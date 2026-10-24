import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Crown,
  Lock,
  Mail,
  Settings as SettingsIcon,
  ShieldCheck,
  User,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { securityOptions, securityTipIds } from '../data/settingsData';
import '../styles/settings.css';

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const isActive = currentUser.status?.active !== false;
  const roleLabel = currentUser.status?.superuser
    ? t('settings.account.superuser')
    : currentUser.roles?.[0] || '-';

  // rows of the "Account" box on the right
  const accountRows = [
    { id: 'name', icon: User, tone: 'primary', label: t('settings.account.name'), value: currentUser.name },
    { id: 'email', icon: Mail, tone: 'blue', label: t('settings.account.email'), value: currentUser.email },
    { id: 'role', icon: Crown, tone: 'amber', label: t('settings.account.role'), value: roleLabel, valueTone: 'amber' },
    {
      id: 'status',
      icon: ShieldCheck,
      tone: 'green',
      label: t('settings.account.status'),
      value: isActive ? t('settings.account.active') : t('settings.account.inactive'),
      valueTone: 'green',
    },
  ];

  return (
    <>
      <Breadcrumb label={t('settings.title')} icon={SettingsIcon} />

      <div className="card-shell">
        {/* ---------- Banner ---------- */}
        <div className="settings-banner">
          <div className="settings-banner-icon">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="settings-banner-title">{t('settings.title')}</h1>
            <p className="settings-banner-sub">{t('settings.subtitle')}</p>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="settings-body">
          <div className="settings-grid">
            {/* left column: Account Security */}
            <section>
              <div className="settings-section-head">
                <div className="settings-section-icon">
                  <Lock size={12} />
                </div>
                <h2 className="settings-section-title">{t('settings.accountSecurity')}</h2>
              </div>

              <div className="settings-options">
                {securityOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`settings-option tone-${option.tone}`}
                      onClick={() => option.path && navigate(option.path)}
                    >
                      <div className="settings-option-icon">
                        <Icon size={20} />
                      </div>

                      <div className="settings-option-text">
                        <div className="settings-option-top">
                          <h3 className="settings-option-title">{t(`settings.options.${option.id}.title`)}</h3>
                          <ChevronRight size={16} className="settings-option-arrow" />
                        </div>
                        <p className="settings-option-desc">{t(`settings.options.${option.id}.description`)}</p>
                        <span className="settings-option-badge">{t(`settings.options.${option.id}.badge`)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* right column: Account box + Security Tips */}
            <aside className="settings-side">
              <div className="settings-account">
                <div className="settings-account-head">
                  <h3 className="settings-side-title">{t('settings.account.title')}</h3>
                </div>

                <div className="settings-account-body">
                  {accountRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div className="settings-account-row" key={row.id}>
                        <div className={`settings-account-icon tone-${row.tone}`}>
                          <Icon size={16} />
                        </div>
                        <div className="settings-account-text">
                          <p className="settings-account-label">{row.label}</p>
                          <p className={`settings-account-value${row.valueTone ? ` value-${row.valueTone}` : ''}`}>
                            {row.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="settings-tips">
                <div className="settings-tips-head">
                  <ShieldCheck size={16} />
                  <h3 className="settings-tips-title">{t('settings.tips.title')}</h3>
                </div>
                <ul className="settings-tips-list">
                  {securityTipIds.map((id) => (
                    <li key={id}>
                      <span className="settings-tip-dot">·</span>
                      <span>{t(`settings.tips.${id}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}