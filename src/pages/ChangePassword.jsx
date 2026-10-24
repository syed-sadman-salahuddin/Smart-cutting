import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CircleAlert,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LockKeyhole,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { changePassword } from '../utils/auth';
import '../styles/change-password.css';

function StatusIcon({ state }) {
  if (state === 'ok') return <CircleCheck size={20} className="cp-status-ok" />;
  if (state === 'bad') return <CircleX size={20} className="cp-status-bad" />;
  return <CircleAlert size={20} className="cp-status-idle" />;
}

function PasswordField({
  id,
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  autoComplete,
  help,
  show,
  onToggle,
  toggleLabel,
}) {
  return (
    <div className="cp-field">
      <label htmlFor={id} className="cp-label">
        {label}
        <span className="cp-required" aria-hidden="true">*</span>
      </label>

      <div className="cp-input-wrap">
        <span className="cp-input-icon">
          <Icon size={16} />
        </span>
        <input
          id={id}
          name={id}
          type={show ? 'text' : 'password'}
          className="cp-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-describedby={help ? `${id}-help` : undefined}
          required
        />
        <button type="button" className="cp-eye" tabIndex={-1} aria-label={toggleLabel} onClick={onToggle}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {help && (
        <p id={`${id}-help`} className="cp-help">
          <Info size={14} />
          <span>{help}</span>
        </p>
      )}
    </div>
  );
}

export default function ChangePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState(''); 
  const [saving, setSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const timers = useRef({});

  useEffect(
    () => () => {
      clearTimeout(timers.current.save);
      clearTimeout(timers.current.toast);
    },
    []
  );

  const toggle = (field) => setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  const checks = {
    length: newPw === '' ? 'idle' : newPw.length >= 8 ? 'ok' : 'bad',
    different: newPw === '' ? 'idle' : newPw !== currentPw ? 'ok' : 'bad',
    match: confirmPw === '' ? 'idle' : confirmPw === newPw ? 'ok' : 'bad',
  };

  const showToast = () => {
    setToastVisible(true);
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToastVisible(false), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;

    if (newPw.length < 8) return setError('tooShort');
    if (newPw === currentPw) return setError('same');
    if (newPw !== confirmPw) return setError('mismatch');

    setError('');
    setSaving(true);
    timers.current.save = setTimeout(() => {
      const result = changePassword(currentPw, newPw);
      setSaving(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setVisible({ current: false, next: false, confirm: false });
      showToast();
    }, 500);
  };

  const showLabel = t('changePassword.showPassword');
  const hideLabel = t('changePassword.hidePassword');

  return (
    <>
      <Breadcrumb
        label={t('changePassword.title')}
        icon={KeyRound}
        parents={[{ label: t('settings.title'), to: '/settings/', icon: SettingsIcon }]}
      />

      <div className="card-shell">
        {/* ---------- Banner ---------- */}
        <div className="cp-banner">
          <div>
            <h1 className="cp-banner-title">{t('changePassword.title')}</h1>
            <div className="cp-pills">
              <span className="cp-pill cp-pill-blue">
                <SettingsIcon size={14} />
                {t('changePassword.badgeSecurity')}
              </span>
              <span className="cp-pill cp-pill-purple">
                <ShieldCheck size={14} />
                {t('changePassword.badgeProtected')}
              </span>
            </div>
          </div>

          <button type="button" className="cp-back-btn" onClick={() => navigate('/settings/')}>
            <ArrowLeft size={16} />
            <span className="cp-text-long">{t('changePassword.backToSettings')}</span>
            <span className="cp-text-short">{t('changePassword.back')}</span>
          </button>
        </div>

        {/* ---------- Body ---------- */}
        <div className="cp-body">
          {/* left: the form */}
          <form className="cp-card cp-form" onSubmit={handleSubmit}>
            <div className="cp-card-head">
              <h2 className="cp-card-title">
                <KeyRound size={16} />
                {t('changePassword.formTitle')}
              </h2>
            </div>

            <div className="cp-form-body">
              <div className="cp-notice">{t('changePassword.notice')}</div>

              {error && (
                <div className="cp-alert" role="alert">
                  <CircleAlert size={16} />
                  <span>{t(`changePassword.errors.${error}`)}</span>
                </div>
              )}

              <PasswordField
                id="current_password"
                label={t('changePassword.currentPassword')}
                placeholder={t('changePassword.currentPlaceholder')}
                icon={LockKeyhole}
                value={currentPw}
                onChange={handleChange(setCurrentPw)}
                autoComplete="current-password"
                show={visible.current}
                onToggle={() => toggle('current')}
                toggleLabel={visible.current ? hideLabel : showLabel}
              />

              <PasswordField
                id="new_password"
                label={t('changePassword.newPassword')}
                placeholder={t('changePassword.newPlaceholder')}
                icon={ShieldCheck}
                value={newPw}
                onChange={handleChange(setNewPw)}
                autoComplete="new-password"
                help={t('changePassword.newHelp')}
                show={visible.next}
                onToggle={() => toggle('next')}
                toggleLabel={visible.next ? hideLabel : showLabel}
              />

              <PasswordField
                id="confirm_password"
                label={t('changePassword.confirmPassword')}
                placeholder={t('changePassword.confirmPlaceholder')}
                icon={CircleCheck}
                value={confirmPw}
                onChange={handleChange(setConfirmPw)}
                autoComplete="new-password"
                show={visible.confirm}
                onToggle={() => toggle('confirm')}
                toggleLabel={visible.confirm ? hideLabel : showLabel}
              />
            </div>

            <div className="cp-form-footer">
              <p className="cp-footer-note">{t('changePassword.footerNote')}</p>
              <button type="submit" className="cp-submit" disabled={saving}>
                <Save size={16} />
                <span className="cp-text-long">
                  {saving ? t('changePassword.updating') : t('changePassword.update')}
                </span>
                <span className="cp-text-short">
                  {saving ? t('changePassword.updating') : t('changePassword.updateShort')}
                </span>
              </button>
            </div>
          </form>

          {/* right: Status / Checklist / Tips */}
          <aside className="cp-side">
            <div className="cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title">
                  <ShieldCheck size={16} />
                  {t('changePassword.status.title')}
                </h2>
              </div>
              <div className="cp-card-body">
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.status.user')}</span>
                  <span className="cp-row-value">{currentUser.name}</span>
                </div>
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.status.email')}</span>
                  <span className="cp-row-value cp-row-truncate">{currentUser.email}</span>
                </div>
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.status.match')}</span>
                  <StatusIcon state={checks.match} />
                </div>
              </div>
            </div>

            <div className="cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title">
                  <ShieldCheck size={16} />
                  {t('changePassword.checklist.title')}
                </h2>
              </div>
              <div className="cp-card-body">
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.checklist.length')}</span>
                  <StatusIcon state={checks.length} />
                </div>
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.checklist.different')}</span>
                  <StatusIcon state={checks.different} />
                </div>
                <div className="cp-row">
                  <span className="cp-row-label">{t('changePassword.checklist.match')}</span>
                  <StatusIcon state={checks.match} />
                </div>
              </div>
            </div>

            <div className="cp-card">
              <div className="cp-card-head">
                <h2 className="cp-card-title">
                  <ShieldCheck size={16} />
                  {t('changePassword.tips.title')}
                </h2>
              </div>
              <div className="cp-card-body cp-tips">
                <p>{t('changePassword.tips.unique')}</p>
                <p>{t('changePassword.tips.guess')}</p>
                <p>{t('changePassword.tips.signOut')}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* "Password updated" popup */}
      <div className={`cp-toast${toastVisible ? '' : ' cp-toast-hidden'}`} role="status" aria-live="polite">
        <CircleCheck size={16} />
        <span>{t('changePassword.success')}</span>
      </div>
    </>
  );
}