export const SIZES_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  return a.name.localeCompare(b.name);
}

const RAW_SIZES = [
  '0',
  '0 TL',
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '26',
  '28',
  '28/30',
  '30',
  '30/30',
  '30/32',
  '32',
  '32/32',
  '34',
  '34/32',
  '34/34',
  '36',
  '36/32',
  '36/34',
  '38',
  '40',
  '42',
  '44',
  '2XS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  'ONE SIZE',
  'FREE SIZE',
];

const CREATED_AT = '2026-09-17T14:48:00';

export const sizesSeed = RAW_SIZES.slice(0, 50)
  .sort((a, b) => a.localeCompare(b))
  .map((name, index) => ({
    id: `size-${String(index + 1).padStart(3, '0')}`,
    name,
    ebsId: index % 7 === 0 ? String(1050 + index) : '',
    status: 'active',
    createdAt: CREATED_AT,
  }));
