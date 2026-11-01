export const COMPANIES_PAGE_SIZES = [10, 25, 50, 100];

export function byCompanyName(a, b) {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

const CREATED_AT = '2026-09-17T14:48:00';

export const companiesSeed = [
  {
    name: 'Agami Washing Ltd.',
    shortName: 'AWL',
    type: 'private',
    email: 'awl@dekkoisho.com',
    phone: '+8801300000006',
    license: '9876543216',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
  {
    name: 'Dekko Fashions Ltd.',
    shortName: 'DFL',
    type: 'private',
    email: 'dfl@dekkoisho.com',
    phone: '+8801300000005',
    license: '9876543215',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
  {
    name: 'Agami Fashions Ltd.',
    shortName: 'AFL',
    type: 'private',
    email: 'afl@dekkoisho.com',
    phone: '+8801300000004',
    license: '9876543214',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
  {
    name: 'Globus Garments Ltd.',
    shortName: 'GGL',
    type: 'private',
    email: 'ggl@dekkoisho.com',
    phone: '+8801300000003',
    license: '9876543213',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
  {
    name: 'Dekko Readywears Ltd.',
    shortName: 'DRL',
    type: 'private',
    email: 'drl@dekkoisho.com',
    phone: '+8801300000002',
    license: '9876543212',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
  {
    name: 'Dekko Garments Ltd.',
    shortName: 'DGL',
    type: 'private',
    email: 'dgl@dekkoisho.com',
    phone: '+8801300000001',
    license: '9876543211',
    established: '2000-01-01',
    website: '',
    address: '',
    status: 'active',
  },
].map((item, index) => ({
  ...item,
  id: `company-${String(index + 1).padStart(3, '0')}`,
  createdAt: CREATED_AT,
}));

export const COMPANY_TYPES = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
  { value: 'government', label: 'Government' },
  { value: 'ngo', label: 'NGO' },
  { value: 'partnership', label: 'Partnership' },
];
