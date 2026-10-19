import { KEYS, readJSON, writeJSON } from './storage';
import { seedCredentials } from '../utils/auth';
import { dashboardSeed, profileSeed } from '../data/seedData';

const DB_VERSION = 2;

function ensure(key, seed) {
  if (readJSON(key, null) === null) writeJSON(key, seed);
}

export function initDatabase() {
  seedCredentials(); 

  if (readJSON(KEYS.dbVersion, 0) !== DB_VERSION) {
    writeJSON(KEYS.profile, profileSeed);
    writeJSON(KEYS.dashboard, dashboardSeed);
    writeJSON(KEYS.dbVersion, DB_VERSION);
    return;
  }

  ensure(KEYS.profile, profileSeed);
  ensure(KEYS.dashboard, dashboardSeed);
}