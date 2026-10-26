export const PARTS_PAGE_SIZES = [10, 25, 50, 100];

const REAL_PARTS = [
  '1. SKRIT',
  'ADDITIONAL BELT',
  'AR -Paiping',
  'AR-Binding',
  'ARM PIPING',
  'Airfril',
  'B -FLF',
  'B-BAL',
  'B-BON',
  'B-CUF',
];


const PREFIXES = [
  'CF', 'CL', 'DT', 'FL', 'FR', 'GU', 'HD', 'KN', 'LN', 'MD',
  'NK', 'PK', 'PL', 'RB', 'SD', 'SL', 'TP', 'WB', 'YK', 'ZP',
];
const PIECES = [
  'BODY', 'BACK', 'FRONT', 'SLEEVE', 'COLLAR', 'CUFF', 'POCKET', 'PLACKET', 'YOKE',
  'BINDING', 'PIPING', 'FACING', 'LINING', 'HOOD', 'WAIST BAND', 'BELT', 'GUSSET',
  'FLAP', 'LOOP', 'TAPE', 'RIB', 'PANEL', 'SIDE', 'BOTTOM', 'NECK',
];

const TOTAL_PARTS = 760;
const CREATED_AT = '2026-09-17T14:48:00';

export function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function buildNames() {
  const names = [...REAL_PARTS];
  for (let round = 1; names.length < TOTAL_PARTS; round += 1) {
    for (const prefix of PREFIXES) {
      for (const piece of PIECES) {
        if (names.length >= TOTAL_PARTS) return names;
        const base = `${prefix}-${piece}`;
        names.push(round === 1 ? base : `${base} ${round}`);
      }
    }
  }
  return names;
}

export const partsSeed = buildNames()
  .map((name) => ({ name }))
  .sort(byName)
  .map(({ name }, index) => ({
    id: `part-${String(index + 1).padStart(3, '0')}`,
    name,
    ebsId: '',
    status: 'active',
    createdAt: CREATED_AT,
  }));