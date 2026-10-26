export const PURCHASE_ORDERS_PAGE_SIZES = [10, 25, 50, 100];

export function byName(a, b) {
  return a.name.localeCompare(b.name);
}

const RAW_PURCHASE_ORDERS = [
  { name: '1654722', ourReference: '5277V01008-T', ebsId: '114320', createdAt: '2026-10-20T17:42:00' },
  { name: '1655310', ourReference: '5277V01019-T', ebsId: '115640', createdAt: '2026-10-05T13:09:00' },
  { name: '1655311', ourReference: '5277V01019-T', ebsId: '115641', createdAt: '2026-10-05T13:09:00' },
  { name: '1655312', ourReference: '5277V01019-T', ebsId: '115642', createdAt: '2026-10-05T13:10:00' },
  { name: '2100241030', ourReference: 'HB27LV01018-B', ebsId: '116773', createdAt: '2026-10-22T18:42:00' },
  { name: '2600043502', ourReference: 'SP27BS1052-T', ebsId: '117269', createdAt: '2026-10-25T11:35:00' },
  { name: '2600043503', ourReference: 'SP27BS1052-T', ebsId: '118200', createdAt: '2026-10-25T11:36:00' },
  { name: '2600043504', ourReference: 'SP27BS1051-T', ebsId: '', createdAt: '2026-10-25T11:21:00' },
  { name: '2600044503', ourReference: '5278S1056-T', ebsId: '121514', createdAt: '2026-09-27T16:24:00' },
  { name: '2820917', ourReference: '5277V031028308-T', ebsId: '114782', createdAt: '2026-09-23T10:30:00' },
  { name: '3100551001', ourReference: 'AW26BST110-B', ebsId: '122110', createdAt: '2026-09-28T09:15:00' },
  { name: '3100551002', ourReference: 'AW27GWL1001-T', ebsId: '122111', createdAt: '2026-09-29T11:30:00' },
  { name: '3100551003', ourReference: 'MF27LV51018-B', ebsId: '122112', createdAt: '2026-09-30T14:45:00' },
  { name: '3200441010', ourReference: 'MFDK27LV52003-T', ebsId: '123040', createdAt: '2026-10-01T10:10:00' },
  { name: '3200441011', ourReference: 'PA26BS1007-B', ebsId: '123041', createdAt: '2026-10-02T13:25:00' },
  { name: '3200441012', ourReference: 'PA26BS1012-B', ebsId: '', createdAt: '2026-10-03T15:50:00' },
  { name: '3300112020', ourReference: '5248ST1169', ebsId: '124115', createdAt: '2026-10-04T09:40:00' },
  { name: '3300112021', ourReference: '5248ST169-B', ebsId: '124116', createdAt: '2026-10-05T12:05:00' },
  { name: '3400773001', ourReference: '.SP27BS1040 T *', ebsId: '125020', createdAt: '2026-10-06T14:30:00' },
  { name: '3400773002', ourReference: '.SP27BS1051 T', ebsId: '125021', createdAt: '2026-10-07T16:15:00' },
  { name: '3500884010', ourReference: 'REF-HM-2026-01', ebsId: '126080', createdAt: '2026-10-08T10:20:00' },
  { name: '3500884011', ourReference: 'REF-HM-2026-02', ebsId: '', createdAt: '2026-10-09T11:45:00' },
  { name: '3600995001', ourReference: 'REF-ZR-2026-01', ebsId: '127150', createdAt: '2026-10-10T14:10:00' },
  { name: '3600995002', ourReference: 'REF-ZR-2026-02', ebsId: '127151', createdAt: '2026-10-11T16:35:00' },
  { name: '3700116020', ourReference: 'REF-GAP-2026-01', ebsId: '128090', createdAt: '2026-10-12T09:25:00' },
  { name: '3800227030', ourReference: 'REF-PVH-2026-01', ebsId: '129140', createdAt: '2026-10-13T12:15:00' },
  { name: '3900338040', ourReference: 'REF-TGT-2026-01', ebsId: '130200', createdAt: '2026-10-14T15:40:00' },
  { name: '4000449050', ourReference: 'REF-WMT-2026-01', ebsId: '', createdAt: '2026-10-15T11:05:00' },
  { name: '4100551060', ourReference: 'REF-CA-2026-01', ebsId: '131150', createdAt: '2026-10-16T13:50:00' },
  { name: '4200662070', ourReference: 'REF-NXT-2026-01', ebsId: '132220', createdAt: '2026-10-17T16:20:00' },
  { name: '4300773080', ourReference: 'REF-MS-2026-01', ebsId: '133090', createdAt: '2026-10-18T10:15:00' },
  { name: '4400884090', ourReference: 'REF-UQ-2026-01', ebsId: '134140', createdAt: '2026-10-19T14:35:00' },
  { name: '4500995100', ourReference: 'REF-TH-2026-01', ebsId: '', createdAt: '2026-10-20T16:50:00' },
  { name: '4600116110', ourReference: 'REF-CK-2026-01', ebsId: '135250', createdAt: '2026-10-21T09:30:00' },
  { name: '4700227120', ourReference: 'REF-AE-2026-01', ebsId: '136110', createdAt: '2026-10-22T11:45:00' },
  { name: '4800338130', ourReference: 'REF-PMA-2026-01', ebsId: '137080', createdAt: '2026-10-23T14:00:00' },
  { name: '4900449140', ourReference: 'REF-ADI-2026-01', ebsId: '138190', createdAt: '2026-10-24T16:10:00' },
  { name: '5000551150', ourReference: 'REF-NKE-2026-01', ebsId: '', createdAt: '2026-10-25T10:05:00' },
  { name: '5100662160', ourReference: 'REF-UA-2026-01', ebsId: '139230', createdAt: '2026-10-25T12:20:00' },
  { name: '5200773170', ourReference: 'REF-PRM-2026-01', ebsId: '140150', createdAt: '2026-10-25T14:40:00' },
  { name: '5300884180', ourReference: 'REF-MNG-2026-01', ebsId: '141090', createdAt: '2026-10-25T16:00:00' },
  { name: '5400995190', ourReference: 'REF-GST-2026-01', ebsId: '142180', createdAt: '2026-10-26T09:15:00' },
  { name: '5500116200', ourReference: 'REF-AF-2026-01', ebsId: '', createdAt: '2026-10-26T10:30:00' },
  { name: '5600227210', ourReference: 'REF-DEC-2026-01', ebsId: '143210', createdAt: '2026-10-26T11:45:00' },
  { name: '5700338220', ourReference: 'REF-LL-2026-01', ebsId: '144080', createdAt: '2026-10-26T13:00:00' },
  { name: '5800449230', ourReference: 'REF-ASOS-2026-01', ebsId: '145150', createdAt: '2026-10-26T14:15:00' },
  { name: '5900551240', ourReference: 'REF-RL-2026-01', ebsId: '146090', createdAt: '2026-10-26T15:30:00' },
  { name: '6000662250', ourReference: 'REF-DSL-2026-01', ebsId: '', createdAt: '2026-10-26T16:00:00' },
  { name: '6100773260', ourReference: 'REF-JJ-2026-01', ebsId: '147180', createdAt: '2026-10-26T16:30:00' },
  { name: '6200884270', ourReference: 'REF-VM-2026-01', ebsId: '148050', createdAt: '2026-10-26T17:00:00' },
];

export const purchaseOrdersSeed = RAW_PURCHASE_ORDERS.slice(0, 50)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((item, index) => ({
    id: `po-${String(index + 1).padStart(3, '0')}`,
    name: item.name,
    ourReference: item.ourReference,
    ebsId: item.ebsId,
    status: 'active',
    createdAt: item.createdAt,
  }));
