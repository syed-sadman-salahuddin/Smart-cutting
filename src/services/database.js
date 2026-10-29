import { KEYS, readJSON, writeJSON } from './storage';
import { seedCredentials } from '../utils/auth';
import { dashboardSeed, profileSeed } from '../data/seedData';
import { partsSeed } from '../data/partsData';
import { departmentsSeed } from '../data/departmentsData';
import { designationsSeed } from '../data/designationsData';
import { shadesSeed } from '../data/shadesData';
import { groupsSeed } from '../data/groupsData';
import { sizesSeed } from '../data/sizesData';
import { colorsSeed } from '../data/colorsData';
import { purchaseOrdersSeed } from '../data/purchaseOrdersData';
import { ourReferencesSeed } from '../data/ourReferencesData';
import { buyersSeed } from '../data/buyersData';
import { cuttingPOsSeed } from '../data/cuttingPOData';
import { cuttingTablesSeed } from '../data/cuttingTablesData';
import { sewingLinesSeed } from '../data/sewingLinesData';
import { bundleCardsSeed } from '../data/bundleCardsData';

const DB_VERSION = 4;

function ensure(key, seed) {
  const current = readJSON(key, null);
  if (current === null || (Array.isArray(current) && current.length === 0)) {
    writeJSON(key, seed);
  }
}

export function initDatabase() {
  seedCredentials();


  ensure(KEYS.parts, partsSeed);
  ensure(KEYS.departments, departmentsSeed);
  ensure(KEYS.designations, designationsSeed);
  ensure(KEYS.shades, shadesSeed);
  ensure(KEYS.groups, groupsSeed);
  ensure(KEYS.sizes, sizesSeed);
  ensure(KEYS.colors, colorsSeed);
  ensure(KEYS.purchaseOrders, purchaseOrdersSeed);
  ensure(KEYS.ourReferences, ourReferencesSeed);
  ensure(KEYS.buyers, buyersSeed);
  ensure(KEYS.cuttingPOs, cuttingPOsSeed);
  ensure(KEYS.cuttingTables, cuttingTablesSeed);
  ensure(KEYS.sewingLines, sewingLinesSeed);
  ensure(KEYS.bundleCards, bundleCardsSeed);

  if (readJSON(KEYS.dbVersion, 0) !== DB_VERSION) {
    writeJSON(KEYS.profile, profileSeed);
    writeJSON(KEYS.dashboard, dashboardSeed);
    writeJSON(KEYS.dbVersion, DB_VERSION);
    return;
  }

  ensure(KEYS.profile, profileSeed);
  ensure(KEYS.dashboard, dashboardSeed);
}