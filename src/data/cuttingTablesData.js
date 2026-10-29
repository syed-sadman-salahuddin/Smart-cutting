export const CUTTING_TABLES_PAGE_SIZES = [10, 25, 50, 100];

export const AVAILABLE_COMPANIES = [
  { id: 'dgl', code: 'DGL', name: 'Dekko Garments Ltd.', label: 'Dekko Garments Ltd. (DGL)' },
  { id: 'drl', code: 'DRL', name: 'Dekko Readywears Ltd.', label: 'Dekko Readywears Ltd. (DRL)' },
  { id: 'ggl', code: 'GGL', name: 'Globus Garments Ltd.', label: 'Globus Garments Ltd. (GGL)' },
  { id: 'afl', code: 'AFL', name: 'Agami Fashions Ltd.', label: 'Agami Fashions Ltd. (AFL)' },
  { id: 'dfl', code: 'DFL', name: 'Dekko Fashions Ltd.', label: 'Dekko Fashions Ltd. (DFL)' },
  { id: 'awl', code: 'AWL', name: 'Agami Washing Ltd.', label: 'Agami Washing Ltd. (AWL)' },
];

export function byTableName(a, b) {
  // Sort alphabetically or naturally
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}

export const cuttingTablesSeed = [
  {
    id: 'table-01',
    name: 'Table 1',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-10',
    name: 'Table 10',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-02',
    name: 'Table 2',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-03',
    name: 'Table 3',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-04',
    name: 'Table 4',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-05',
    name: 'Table 5',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-06',
    name: 'Table 6',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-07',
    name: 'Table 7',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-08',
    name: 'Table 8',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
  {
    id: 'table-09',
    name: 'Table 9',
    ebsId: '',
    companies: ['DRL', 'DGL'],
    status: 'active',
    createdAt: '2026-09-17T14:48:00',
  },
];
