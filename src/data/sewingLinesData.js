export const SEWING_LINES_PAGE_SIZES = [10, 25, 50, 100];

export const AVAILABLE_COMPANIES = [
  { id: 'dgl', code: 'DGL', name: 'Dekko Garments Ltd.', label: 'Dekko Garments Ltd. (DGL)' },
  { id: 'drl', code: 'DRL', name: 'Dekko Readywears Ltd.', label: 'Dekko Readywears Ltd. (DRL)' },
  { id: 'ggl', code: 'GGL', name: 'Globus Garments Ltd.', label: 'Globus Garments Ltd. (GGL)' },
  { id: 'afl', code: 'AFL', name: 'Agami Fashions Ltd.', label: 'Agami Fashions Ltd. (AFL)' },
  { id: 'dfl', code: 'DFL', name: 'Dekko Fashions Ltd.', label: 'Dekko Fashions Ltd. (DFL)' },
  { id: 'awl', code: 'AWL', name: 'Agami Washing Ltd.', label: 'Agami Washing Ltd. (AWL)' },
];

export function byLineName(a, b) {
  return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
}

export const sewingLinesSeed = [
  { id: 'line-01', name: 'Line 1',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-02', name: 'Line 2',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-03', name: 'Line 3',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-04', name: 'Line 4',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-05', name: 'Line 5',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-06', name: 'Line 6',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-07', name: 'Line 7',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-08', name: 'Line 8',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-09', name: 'Line 9',  ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-10', name: 'Line 10', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-11', name: 'Line 11', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-12', name: 'Line 12', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-13', name: 'Line 13', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-14', name: 'Line 14', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-15', name: 'Line 15', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-16', name: 'Line 16', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-17', name: 'Line 17', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-18', name: 'Line 18', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-19', name: 'Line 19', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-20', name: 'Line 20', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-21', name: 'Line 21', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-22', name: 'Line 22', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
  { id: 'line-23', name: 'Line 23', ebsId: '', companies: ['DRL', 'DGL'], status: 'active', createdAt: '2026-09-17T14:48:00' },
];
