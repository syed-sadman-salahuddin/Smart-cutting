export const SHADES_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

const RAW_SHADES = [
  "'38480",
  "(- ) A",
  "(- ) B",
  "(-)I",
  "(-)L",
  "(--) 1B",
  "(--)1A",
  "(--)2A",
  "(--)2B",
  "(--)2C",
  "(--)3A",
  "(--)3B",
  "(--)4A",
  "(--)4B",
  "(-)1",
  "(-)2",
  "(+) 1A",
  "(+) 1B",
  "(+) 2A",
  "(+) 2B",
  "(+)1A",
  "(+)2A",
  "(++) 1A",
  "(++) 1B",
  "(++) 2A",
  "(++) 2B",
  "A-1",
  "A-2",
  "B-1",
  "B-2",
  "C-1",
  "C-2",
  "DARK-A",
  "DARK-B",
  "DYE-01",
  "DYE-02",
  "LIGHT-A",
  "LIGHT-B",
  "LOT-101",
  "LOT-102",
  "LOT-103",
  "MEDIUM-A",
  "MEDIUM-B",
  "SHADE-01",
  "SHADE-02",
  "SHADE-03",
  "STD",
  "STD (+1)",
  "STD (-1)",
  "TONE-A",
];

const CREATED_AT = '2026-09-17T14:48:00';

export const shadesSeed = RAW_SHADES.slice(0, 50)
  .sort(byName)
  .map((name, index) => ({
    id: `shade-${String(index + 1).padStart(3, '0')}`,
    name,
    ebsId: '',
    status: 'active',
    createdAt: CREATED_AT,
  }));
