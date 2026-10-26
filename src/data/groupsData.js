export const GROUPS_PAGE_SIZES = [10, 20, 50, 100];

export function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

const CREATED_AT = '2026-09-17T14:48:00';

export const groupsSeed = Array.from({ length: 20 }, (_, index) => ({
  id: `group-${String(index + 1).padStart(3, '0')}`,
  name: `Group ${String.fromCharCode(65 + index)}`,
  ebsId: '',
  status: 'active',
  createdAt: CREATED_AT,
}));
