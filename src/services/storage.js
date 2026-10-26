export const KEYS = {
  users: 'st-users',
  session: 'st-session',
  appearance: 'st-appearance',
  sidebarCollapsed: 'st-sidebar-collapsed',
  language: 'st-language',

  dbVersion: 'st-db-version',
  profile: 'st-profile',
  dashboard: 'st-dashboard',
  parts: 'st-parts',
  shades: 'st-shades',
  groups: 'st-groups',
  sizes: 'st-sizes',
  colors: 'st-colors',
  purchaseOrders: 'st-purchase-orders',
  ourReferences: 'st-our-references',
  buyers: 'st-buyers',
  notifications: 'st-notifications',
};

export const STORAGE_EVENT = 'st-storage';

export function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  } catch {
    // ignore
  }
}