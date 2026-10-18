import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, EyeOff, ArrowRight, Moon, Sun, CircleAlert } from 'lucide-react';
import { isAuthenticated, login } from '../utils/auth';
import { applyAppearance, loadAppearance, saveAppearance } from '../utils/theme';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // if the user was sent here from another page, go back to it after login
  const redirectTo = location.state?.from?.pathname || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => loadAppearance().mode === 'dark');
  const [toastVisible, setToastVisible] = useState(false);

  const passwordRef = useRef(null);
  const timers = useRef({});

  // stop pending timers when leaving the page
  useEffect(
    () => () => {
      clearTimeout(timers.current.submit);
      clearTimeout(timers.current.toast);
    },
    []
  );

  // already signed in -> no need to see the login page
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  const showErrorToast = () => {
    setToastVisible(true);
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToastVisible(false), 3500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    // a short delay so the "Signing in..." state is visible
    timers.current.submit = setTimeout(() => {
      if (login(identifier, password, remember)) {
        navigate(redirectTo, { replace: true });
      } else {
        setLoading(false);
        setPassword('');
        showErrorToast();
        passwordRef.current?.focus();
      }
    }, 600);
  };

  const toggleTheme = () => {
    const current = loadAppearance();
    const next = { ...current, mode: current.mode === 'dark' ? 'light' : 'dark' };
    saveAppearance(next);
    applyAppearance(next);
    setIsDark(next.mode === 'dark');
  };

  return (
    <div className="login-page">
      {/* dark / light switch (top right) */}
      <div className="login-top-right fade-up">
        <button type="button" className="login-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="login-wrap">
        <div className="login-card fade-up">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to pick up right where you left off</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* email */}
            <div>
              <label htmlFor="email_or_phone" className="login-label">
                Email
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Mail size={16} />
                </span>
                <input
                  id="email_or_phone"
                  name="email_or_phone"
                  type="text"
                  required
                  autoComplete="username"
                  className="form-control"
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="field-wrap">
                <span className="field-icon">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="form-control form-control-pw"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="field-action">
                  <button
                    type="button"
                    className="toggle-pw"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </span>
              </div>
            </div>

            {/* remember me */}
            <div className="login-row">
              <label className="remember-label">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="remember-checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="remember-text">Remember me</span>
              </label>
            </div>

            {/* submit */}
            <button type="submit" className="login-submit" disabled={loading}>
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        <p className="login-footer fade-up">
          <span>Protected by</span> <strong>Dekko Isho Group</strong>
        </p>
      </div>

      {/* "Invalid credentials" popup */}
      <div className={`toast${toastVisible ? '' : ' toast-hidden'}`} role="alert" aria-live="assertive">
        <div className="toast-box">
          <CircleAlert size={16} className="toast-icon" />
          <span className="toast-message">Invalid credentials</span>
        </div>
      </div>
    </div>
  );
}