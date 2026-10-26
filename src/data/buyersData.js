export const BUYERS_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  return a.name.localeCompare(b.name);
}

const RAW_BUYERS = [
  'Bestseller',
  'GREENWEAR LIMITED',
  'Levis',
  'H&M',
  'Zara',
  'Gap Inc.',
  'PVH Corp.',
  'Target',
  'Walmart',
  'C&A',
  'Next',
  'Marks & Spencer',
  'Uniqlo',
  'Tommy Hilfiger',
  'Calvin Klein',
  'American Eagle',
  'Puma',
  'Adidas',
  'Nike',
  'Under Armour',
  'Primark',
  'Mango',
  'G-Star RAW',
  'Abercrombie & Fitch',
  'Decathlon',
  'Lululemon',
  'ASOS',
  'Tesco',
  'Carrefour',
  'Columbia Sportswear',
  'Timberland',
  'Ralph Lauren',
  'Diesel',
  'Benetton',
  'Jack & Jones',
  'Only',
  'Vero Moda',
  'Name It',
  'Selected',
  'Esprit',
  'Pull&Bear',
  'Bershka',
  'Massimo Dutti',
  'Stradivarius',
  'OVS',
  'LC Waikiki',
  'DeFacto',
  'Kohl\'s',
  'JCPenney',
  'Nordstrom',
];

const CREATED_AT = '2026-09-17T14:48:00';

export const buyersSeed = RAW_BUYERS.slice(0, 50)
  .sort((a, b) => a.localeCompare(b))
  .map((name, index) => ({
    id: `buyer-${String(index + 1).padStart(3, '0')}`,
    name,
    ebsId: index % 4 === 0 ? String(10200 + index * 17) : '',
    status: 'active',
    createdAt: CREATED_AT,
  }));
