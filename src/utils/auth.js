const USERS_KEY = 'st-users';
const SESSION_KEY = 'st-session';

const DEFAULT_USERS = [{ email: 'superuser@test.com', password: '123456' }];

// make sure the dummy users exist in localStorage and return them
export function seedCredentials() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(users) && users.length > 0) return users;
  } catch {

  }
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  } catch {
    
  }
  return DEFAULT_USERS;
}

export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

export function getSessionEmail() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw).email || null : null;
  } catch {
    return null;
  }
}

export function login(identifier, password, remember = false) {
  const email = identifier.trim().toLowerCase();
  const valid = seedCredentials().some(
    (user) => user.email.toLowerCase() === email && user.password === password
  );
  if (!valid) return false;

  logout(); 
  const session = JSON.stringify({ email, loggedInAt: Date.now() });
  try {
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, session);
  } catch {
    return false;
  }
  return true;
}


export function changePassword(currentPassword, newPassword) {
  const email = getSessionEmail();
  if (!email) return { ok: false, error: 'noSession' };

  const users = seedCredentials();
  const index = users.findIndex((user) => user.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return { ok: false, error: 'noSession' };
  if (users[index].password !== currentPassword) return { ok: false, error: 'wrongCurrent' };

  const updated = users.map((user, i) => (i === index ? { ...user, password: newPassword } : user));
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  } catch {
    return { ok: false, error: 'saveFailed' };
  }
  return { ok: true };
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}