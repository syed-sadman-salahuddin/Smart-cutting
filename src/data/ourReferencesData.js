export const OUR_REFERENCES_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  return a.name.localeCompare(b.name);
}

const RAW_REFERENCES = [
  { name: '.SP27BS1040 T *', buyer: 'Bestseller', ebsId: '', createdAt: '2026-09-23T11:56:00' },
  { name: '.SP27BS1051 T', buyer: 'Bestseller', ebsId: '', createdAt: '2026-10-25T11:19:00' },
  { name: 'AW26BST110-B', buyer: 'Bestseller', ebsId: '', createdAt: '2026-09-23T10:32:00' },
  { name: 'AW27GWL1001-T', buyer: 'GREENWEAR LIMITED', ebsId: '30197', createdAt: '2026-09-17T16:32:00' },
  { name: 'MF27LV51018-B', buyer: 'Levis', ebsId: '29576', createdAt: '2026-10-22T18:42:00' },
  { name: 'MFDK27LV52003-T', buyer: 'Levis', ebsId: '29251', createdAt: '2026-09-23T11:15:00' },
  { name: 'PA26BS1007-B', buyer: 'Bestseller', ebsId: '', createdAt: '2026-09-17T16:03:00' },
  { name: 'PA26BS1012-B', buyer: 'Bestseller', ebsId: '', createdAt: '2026-10-17T18:22:00' },
  { name: '5248ST1169', buyer: 'Bestseller', ebsId: '19443', createdAt: '2026-10-05T12:43:00' },
  { name: '5248ST169-B', buyer: 'Bestseller', ebsId: '', createdAt: '2026-09-19T17:48:00' },
  { name: '5277V01008-T', buyer: 'H&M', ebsId: '21045', createdAt: '2026-09-20T10:14:00' },
  { name: '5277V01019-T', buyer: 'Zara', ebsId: '21088', createdAt: '2026-09-21T14:22:00' },
  { name: '5277V031028308-T', buyer: 'Gap Inc.', ebsId: '21450', createdAt: '2026-09-22T09:30:00' },
  { name: '5278S1056-T', buyer: 'PVH Corp.', ebsId: '22190', createdAt: '2026-09-24T11:45:00' },
  { name: 'HB27LV01018-B', buyer: 'Levis', ebsId: '23004', createdAt: '2026-09-25T13:10:00' },
  { name: 'SP27BS1051-T', buyer: 'Bestseller', ebsId: '23512', createdAt: '2026-09-26T15:20:00' },
  { name: 'SP27BS1052-T', buyer: 'Bestseller', ebsId: '24180', createdAt: '2026-09-27T16:50:00' },
  { name: 'REF-HM-2026-01', buyer: 'H&M', ebsId: '25010', createdAt: '2026-09-28T12:00:00' },
  { name: 'REF-HM-2026-02', buyer: 'H&M', ebsId: '', createdAt: '2026-09-29T10:15:00' },
  { name: 'REF-ZR-2026-01', buyer: 'Zara', ebsId: '26040', createdAt: '2026-09-30T14:40:00' },
  { name: 'REF-ZR-2026-02', buyer: 'Zara', ebsId: '', createdAt: '2026-10-01T09:25:00' },
  { name: 'REF-GAP-2026-01', buyer: 'Gap Inc.', ebsId: '27120', createdAt: '2026-10-02T11:35:00' },
  { name: 'REF-PVH-2026-01', buyer: 'PVH Corp.', ebsId: '28050', createdAt: '2026-10-03T16:10:00' },
  { name: 'REF-TGT-2026-01', buyer: 'Target', ebsId: '29090', createdAt: '2026-10-04T13:55:00' },
  { name: 'REF-WMT-2026-01', buyer: 'Walmart', ebsId: '30110', createdAt: '2026-10-05T15:05:00' },
  { name: 'REF-CA-2026-01', buyer: 'C&A', ebsId: '', createdAt: '2026-10-06T10:50:00' },
  { name: 'REF-NXT-2026-01', buyer: 'Next', ebsId: '31200', createdAt: '2026-10-07T12:45:00' },
  { name: 'REF-MS-2026-01', buyer: 'Marks & Spencer', ebsId: '32080', createdAt: '2026-10-08T14:15:00' },
  { name: 'REF-UQ-2026-01', buyer: 'Uniqlo', ebsId: '', createdAt: '2026-10-09T09:40:00' },
  { name: 'REF-TH-2026-01', buyer: 'Tommy Hilfiger', ebsId: '33150', createdAt: '2026-10-10T11:20:00' },
  { name: 'REF-CK-2026-01', buyer: 'Calvin Klein', ebsId: '34020', createdAt: '2026-10-11T15:30:00' },
  { name: 'REF-AE-2026-01', buyer: 'American Eagle', ebsId: '', createdAt: '2026-10-12T16:00:00' },
  { name: 'REF-PMA-2026-01', buyer: 'Puma', ebsId: '35110', createdAt: '2026-10-13T10:05:00' },
  { name: 'REF-ADI-2026-01', buyer: 'Adidas', ebsId: '36090', createdAt: '2026-10-14T13:40:00' },
  { name: 'REF-NKE-2026-01', buyer: 'Nike', ebsId: '37180', createdAt: '2026-10-15T15:15:00' },
  { name: 'REF-UA-2026-01', buyer: 'Under Armour', ebsId: '', createdAt: '2026-10-16T11:50:00' },
  { name: 'REF-PRM-2026-01', buyer: 'Primark', ebsId: '38240', createdAt: '2026-10-17T09:10:00' },
  { name: 'REF-MNG-2026-01', buyer: 'Mango', ebsId: '39100', createdAt: '2026-10-18T14:25:00' },
  { name: 'REF-GST-2026-01', buyer: 'G-Star RAW', ebsId: '', createdAt: '2026-10-19T16:35:00' },
  { name: 'REF-AF-2026-01', buyer: 'Abercrombie & Fitch', ebsId: '40050', createdAt: '2026-10-20T10:45:00' },
  { name: 'REF-DEC-2026-01', buyer: 'Decathlon', ebsId: '41120', createdAt: '2026-10-21T12:15:00' },
  { name: 'REF-LL-2026-01', buyer: 'Lululemon', ebsId: '', createdAt: '2026-10-22T14:50:00' },
  { name: 'REF-ASOS-2026-01', buyer: 'ASOS', ebsId: '42200', createdAt: '2026-10-23T09:35:00' },
  { name: 'REF-RL-2026-01', buyer: 'Ralph Lauren', ebsId: '43080', createdAt: '2026-10-24T11:05:00' },
  { name: 'REF-DSL-2026-01', buyer: 'Diesel', ebsId: '', createdAt: '2026-10-25T13:20:00' },
  { name: 'REF-JJ-2026-01', buyer: 'Jack & Jones', ebsId: '44190', createdAt: '2026-10-25T15:40:00' },
  { name: 'REF-VM-2026-01', buyer: 'Vero Moda', ebsId: '45020', createdAt: '2026-10-25T16:15:00' },
  { name: 'REF-ONL-2026-01', buyer: 'Only', ebsId: '', createdAt: '2026-10-26T10:10:00' },
  { name: 'REF-PB-2026-01', buyer: 'Pull&Bear', ebsId: '46150', createdAt: '2026-10-26T11:25:00' },
  { name: 'REF-BSH-2026-01', buyer: 'Bershka', ebsId: '47080', createdAt: '2026-10-26T12:00:00' },
];

export const ourReferencesSeed = RAW_REFERENCES.slice(0, 50)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((item, index) => ({
    id: `ref-${String(index + 1).padStart(3, '0')}`,
    name: item.name,
    buyer: item.buyer,
    ebsId: item.ebsId,
    status: 'active',
    createdAt: item.createdAt,
  }));
