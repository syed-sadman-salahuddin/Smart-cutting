
const USERS_KEY = 'st-users';
const SESSION_KEY = 'st-session';

const DEFAULT_USERS = [{ email: 'superuser@test.com', password: '123456' }];


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


export function login(identifier, password, remember = false) {
  const email = identifier.trim().toLowerCase();
  const valid = seedCredentials().some(
    (user) => user.email.toLowerCase() === email && user.password === password
  );
  if (!valid) return false;

  logout(); // clear any older session first
  const session = JSON.stringify({ email, loggedInAt: Date.now() });
  try {
    (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, session);
  } catch {
    return false;
  }
  return true;
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
  }
}