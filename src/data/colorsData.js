export const COLORS_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  return a.name.localeCompare(b.name);
}

const RAW_COLORS = [
  { name: '.DUSTY BLUE', ebsId: '', createdAt: '2026-10-20T17:59:00' },
  { name: '.RINSE BLACK', ebsId: '11207', createdAt: '2026-10-19T11:48:00' },
  { name: '.STRING', ebsId: '', createdAt: '2026-10-25T11:28:00' },
  { name: '.TAUPE 01', ebsId: '', createdAt: '2026-10-25T11:53:00' },
  { name: '.VERT SAUGE', ebsId: '', createdAt: '2026-10-25T11:48:00' },
  { name: '001BLACK', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '001/Print', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '002/BLACK', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '004/BLACK', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '01-WHITE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '02-NAVY', ebsId: '11301', createdAt: '2026-09-17T14:48:00' },
  { name: '03-RED', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '04-OLIVE', ebsId: '11305', createdAt: '2026-09-17T14:48:00' },
  { name: '05-CHARCOAL', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '06-HEATHER GREY', ebsId: '11310', createdAt: '2026-09-17T14:48:00' },
  { name: '07-BURGUNDY', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '08-KHAKI', ebsId: '11318', createdAt: '2026-09-17T14:48:00' },
  { name: '09-ROYAL BLUE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '10-SAGE GREEN', ebsId: '11325', createdAt: '2026-09-17T14:48:00' },
  { name: '11-CORAL', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '12-MUSTARD', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '13-TEAL', ebsId: '11330', createdAt: '2026-09-17T14:48:00' },
  { name: '14-LAVENDER', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '15-MAROON', ebsId: '11342', createdAt: '2026-09-17T14:48:00' },
  { name: '16-INDIGO', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '17-BEIGE', ebsId: '11350', createdAt: '2026-09-17T14:48:00' },
  { name: '18-CAMEL', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: '19-CHOCOLATE', ebsId: '11360', createdAt: '2026-09-17T14:48:00' },
  { name: '20-OFF WHITE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'BLACK 01', ebsId: '11370', createdAt: '2026-09-17T14:48:00' },
  { name: 'BLEACH WASH', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'DARK DENIM', ebsId: '11380', createdAt: '2026-09-17T14:48:00' },
  { name: 'LIGHT STONE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'MEDIUM BLUE', ebsId: '11390', createdAt: '2026-09-17T14:48:00' },
  { name: 'MIDNIGHT NAVY', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'MINT', ebsId: '11400', createdAt: '2026-09-17T14:48:00' },
  { name: 'OPTIC WHITE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'PALE PINK', ebsId: '11410', createdAt: '2026-09-17T14:48:00' },
  { name: 'PEACH', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'ROSE', ebsId: '11420', createdAt: '2026-09-17T14:48:00' },
  { name: 'RUST', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'SAND', ebsId: '11430', createdAt: '2026-09-17T14:48:00' },
  { name: 'SKY BLUE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'SMOKE GREY', ebsId: '11440', createdAt: '2026-09-17T14:48:00' },
  { name: 'SNOW WHITE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'STEEL BLUE', ebsId: '11450', createdAt: '2026-09-17T14:48:00' },
  { name: 'SUNSET ORANGE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'VINTAGE WASH', ebsId: '11460', createdAt: '2026-09-17T14:48:00' },
  { name: 'WHITE/NAVY STRIPE', ebsId: '', createdAt: '2026-09-17T14:48:00' },
  { name: 'YELLOW SUN', ebsId: '11470', createdAt: '2026-09-17T14:48:00' },
];

export const colorsSeed = RAW_COLORS.slice(0, 50)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((item, index) => ({
    id: `color-${String(index + 1).padStart(3, '0')}`,
    name: item.name,
    ebsId: item.ebsId,
    status: 'active',
    createdAt: item.createdAt,
  }));
