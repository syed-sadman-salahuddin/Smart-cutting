export const DEPARTMENTS_PAGE_SIZES = [10, 25, 50, 100];

export function byDepartmentName(a, b) {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

const CREATED_AT = '2026-09-17T14:48:00';

export const departmentsSeed = [
  'Fabric & Dice Cutting',
  'HR & Administration',
  'Industrial Engineering',
  'Information Technology',
  'Product Research & Development',
  'Production',
].map((name, index) => ({
  id: `department-${String(index + 1).padStart(3, '0')}`,
  name,
  description: '',
  status: 'active',
  createdAt: CREATED_AT,
}));
