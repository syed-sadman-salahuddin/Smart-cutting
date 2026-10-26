import { KEYS, readJSON, writeJSON } from './storage';
import { seedCredentials } from '../utils/auth';
import { dashboardSeed, profileSeed } from '../data/seedData';
import { partsSeed } from '../data/partsData';
import { shadesSeed } from '../data/shadesData';
import { groupsSeed } from '../data/groupsData';
import { sizesSeed } from '../data/sizesData';
import { colorsSeed } from '../data/colorsData';
import { purchaseOrdersSeed } from '../data/purchaseOrdersData';
import { ourReferencesSeed } from '../data/ourReferencesData';
import { buyersSeed } from '../data/buyersData';
import { cuttingPOsSeed } from '../data/cuttingPOData';

const DB_VERSION = 3;

function ensure(key, seed) {
  if (readJSON(key, null) === null) writeJSON(key, seed);
}

export function initDatabase() {
  seedCredentials();


  ensure(KEYS.parts, partsSeed);
  ensure(KEYS.shades, shadesSeed);
  ensure(KEYS.groups, groupsSeed);
  ensure(KEYS.sizes, sizesSeed);
  ensure(KEYS.colors, colorsSeed);
  ensure(KEYS.purchaseOrders, purchaseOrdersSeed);
  ensure(KEYS.ourReferences, ourReferencesSeed);
  ensure(KEYS.buyers, buyersSeed);
  ensure(KEYS.cuttingPOs, cuttingPOsSeed);

  if (readJSON(KEYS.dbVersion, 0) !== DB_VERSION) {
    writeJSON(KEYS.profile, profileSeed);
    writeJSON(KEYS.dashboard, dashboardSeed);
    writeJSON(KEYS.dbVersion, DB_VERSION);
    return;
  }

  ensure(KEYS.profile, profileSeed);
  ensure(KEYS.dashboard, dashboardSeed);
}