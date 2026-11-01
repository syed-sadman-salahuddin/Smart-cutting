export const permissionsGroupsSeed = [
  {
    id: 'cutting-ratio-group',
    name: 'Cutting Ratio Group',
    permissions: [
      { id: 'auth-add-group', name: 'Can add group', codename: 'auth.add_group' },
      { id: 'auth-change-group', name: 'Can change group', codename: 'auth.change_group' },
      { id: 'auth-delete-group', name: 'Can delete group', codename: 'auth.delete_group' },
      { id: 'auth-view-group', name: 'Can view group', codename: 'auth.view_group' },
      { id: 'general-add-group', name: 'Can add Cutting Ratio Group', codename: 'general.add_group' },
      { id: 'general-change-group', name: 'Can change Cutting Ratio Group', codename: 'general.change_group' },
      { id: 'general-delete-group', name: 'Can delete Cutting Ratio Group', codename: 'general.delete_group' },
      { id: 'general-view-group', name: 'Can view Cutting Ratio Group', codename: 'general.view_group' },
    ],
  },
  {
    id: 'permission',
    name: 'Permission',
    permissions: [
      { id: 'auth-add-permission', name: 'Can add permission', codename: 'auth.add_permission' },
      { id: 'auth-change-permission', name: 'Can change permission', codename: 'auth.change_permission' },
      { id: 'auth-delete-permission', name: 'Can delete permission', codename: 'auth.delete_permission' },
      { id: 'auth-view-permission', name: 'Can view permission', codename: 'auth.view_permission' },
    ],
  },
  {
    id: 'company',
    name: 'Company',
    permissions: [
      { id: 'company-add-company', name: 'Can add Company', codename: 'company.add_company' },
      { id: 'company-change-company', name: 'Can change Company', codename: 'company.change_company' },
      { id: 'company-delete-company', name: 'Can delete Company', codename: 'company.delete_company' },
      { id: 'company-view-company', name: 'Can view Company', codename: 'company.view_company' },
    ],
  },
  {
    id: 'department',
    name: 'Department',
    permissions: [
      { id: 'company-add-department', name: 'Can add Department', codename: 'company.add_department' },
      { id: 'company-change-department', name: 'Can change Department', codename: 'company.change_department' },
      { id: 'company-delete-department', name: 'Can delete Department', codename: 'company.delete_department' },
      { id: 'company-view-department', name: 'Can view Department', codename: 'company.view_department' },
    ],
  },
  {
    id: 'designation',
    name: 'Designation',
    permissions: [
      { id: 'company-add-designation', name: 'Can add Designation', codename: 'company.add_designation' },
      { id: 'company-change-designation', name: 'Can change Designation', codename: 'company.change_designation' },
      { id: 'company-delete-designation', name: 'Can delete Designation', codename: 'company.delete_designation' },
      { id: 'company-view-designation', name: 'Can view Designation', codename: 'company.view_designation' },
    ],
  },
  {
    id: 'bundle',
    name: 'Bundle',
    permissions: [
      { id: 'cutting-add-bundle', name: 'Can add Bundle Card', codename: 'cutting.add_bundle' },
      { id: 'cutting-change-bundle', name: 'Can change Bundle Card', codename: 'cutting.change_bundle' },
      { id: 'cutting-delete-bundle', name: 'Can delete Bundle Card', codename: 'cutting.delete_bundle' },
      { id: 'cutting-view-bundle', name: 'Can view Bundle Card', codename: 'cutting.view_bundle' },
    ],
  },
  {
    id: 'cutting-po',
    name: 'Cutting PO',
    permissions: [
      { id: 'cutting-add-cuttingpo', name: 'Can add Cutting PO', codename: 'cutting.add_cuttingpo' },
      { id: 'cutting-change-cuttingpo', name: 'Can change Cutting PO', codename: 'cutting.change_cuttingpo' },
      { id: 'cutting-delete-cuttingpo', name: 'Can delete Cutting PO', codename: 'cutting.delete_cuttingpo' },
      { id: 'cutting-view-cuttingpo', name: 'Can view Cutting PO', codename: 'cutting.view_cuttingpo' },
    ],
  },
  {
    id: 'employee',
    name: 'Employee',
    permissions: [
      { id: 'employee-add-employee', name: 'Can add Employee', codename: 'employee.add_employee' },
      { id: 'employee-change-employee', name: 'Can change Employee', codename: 'employee.change_employee' },
      { id: 'employee-delete-employee', name: 'Can delete Employee', codename: 'employee.delete_employee' },
      { id: 'employee-view-employee', name: 'Can view Employee', codename: 'employee.view_employee' },
    ],
  },
  {
    id: 'cutting-table',
    name: 'Cutting Table',
    permissions: [
      { id: 'general-add-cuttingtable', name: 'Can add Cutting Table', codename: 'general.add_cuttingtable' },
      { id: 'general-change-cuttingtable', name: 'Can change Cutting Table', codename: 'general.change_cuttingtable' },
      { id: 'general-delete-cuttingtable', name: 'Can delete Cutting Table', codename: 'general.delete_cuttingtable' },
      { id: 'general-view-cuttingtable', name: 'Can view Cutting Table', codename: 'general.view_cuttingtable' },
    ],
  },
  {
    id: 'cutting-part',
    name: 'Cutting Part',
    permissions: [
      { id: 'general-add-part', name: 'Can add Cutting Part', codename: 'general.add_part' },
      { id: 'general-change-part', name: 'Can change Cutting Part', codename: 'general.change_part' },
      { id: 'general-delete-part', name: 'Can delete Cutting Part', codename: 'general.delete_part' },
      { id: 'general-view-part', name: 'Can view Cutting Part', codename: 'general.view_part' },
    ],
  },
  {
    id: 'sewing-line',
    name: 'Sewing Line',
    permissions: [
      { id: 'general-add-sewingline', name: 'Can add Sewing Line', codename: 'general.add_sewingline' },
      { id: 'general-change-sewingline', name: 'Can change Sewing Line', codename: 'general.change_sewingline' },
      { id: 'general-delete-sewingline', name: 'Can delete Sewing Line', codename: 'general.delete_sewingline' },
      { id: 'general-view-sewingline', name: 'Can view Sewing Line', codename: 'general.view_sewingline' },
    ],
  },
  {
    id: 'fabric-shade',
    name: 'Fabric Shade',
    permissions: [
      { id: 'general-add-shade', name: 'Can add Fabric Shade', codename: 'general.add_shade' },
      { id: 'general-change-shade', name: 'Can change Fabric Shade', codename: 'general.change_shade' },
      { id: 'general-delete-shade', name: 'Can delete Fabric Shade', codename: 'general.delete_shade' },
      { id: 'general-view-shade', name: 'Can view Fabric Shade', codename: 'general.view_shade' },
    ],
  },
  {
    id: 'buyer',
    name: 'Buyer',
    permissions: [
      { id: 'po-add-buyer', name: 'Can add Buyer', codename: 'po.add_buyer' },
      { id: 'po-change-buyer', name: 'Can change Buyer', codename: 'po.change_buyer' },
      { id: 'po-delete-buyer', name: 'Can delete Buyer', codename: 'po.delete_buyer' },
      { id: 'po-view-buyer', name: 'Can view Buyer', codename: 'po.view_buyer' },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    permissions: [
      { id: 'po-add-color', name: 'Can add Color', codename: 'po.add_color' },
      { id: 'po-change-color', name: 'Can change Color', codename: 'po.change_color' },
      { id: 'po-delete-color', name: 'Can delete Color', codename: 'po.delete_color' },
      { id: 'po-view-color', name: 'Can view Color', codename: 'po.view_color' },
    ],
  },
  {
    id: 'our-reference',
    name: 'Our Reference',
    permissions: [
      { id: 'po-add-ourreference', name: 'Can add Our Reference', codename: 'po.add_ourreference' },
      { id: 'po-change-ourreference', name: 'Can change Our Reference', codename: 'po.change_ourreference' },
      { id: 'po-delete-ourreference', name: 'Can delete Our Reference', codename: 'po.delete_ourreference' },
      { id: 'po-view-ourreference', name: 'Can view Our Reference', codename: 'po.view_ourreference' },
    ],
  },
  {
    id: 'po',
    name: 'PO',
    permissions: [
      { id: 'po-add-po', name: 'Can add PO', codename: 'po.add_po' },
      { id: 'po-change-po', name: 'Can change PO', codename: 'po.change_po' },
      { id: 'po-delete-po', name: 'Can delete PO', codename: 'po.delete_po' },
      { id: 'po-view-po', name: 'Can view PO', codename: 'po.view_po' },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    permissions: [
      { id: 'po-add-size', name: 'Can add Size', codename: 'po.add_size' },
      { id: 'po-change-size', name: 'Can change Size', codename: 'po.change_size' },
      { id: 'po-delete-size', name: 'Can delete Size', codename: 'po.delete_size' },
      { id: 'po-view-size', name: 'Can view Size', codename: 'po.view_size' },
    ],
  },
  {
    id: 'user',
    name: 'User',
    permissions: [
      { id: 'users-add-user', name: 'Can add User', codename: 'users.add_user' },
      { id: 'users-change-user', name: 'Can change User', codename: 'users.change_user' },
      { id: 'users-delete-user', name: 'Can delete User', codename: 'users.delete_user' },
      { id: 'users-view-user', name: 'Can view User', codename: 'users.view_user' },
    ],
  },
];

export function getTotalPermissionsCount(groups = permissionsGroupsSeed) {
  return groups.reduce((acc, g) => acc + (g.permissions ? g.permissions.length : 0), 0);
}

export function filterPermissionsGroups(groups = permissionsGroupsSeed, query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return groups;

  return groups
    .map((group) => {
      const groupNameMatches = group.name.toLowerCase().includes(q);
      const matchingPermissions = group.permissions.filter(
        (perm) =>
          groupNameMatches ||
          perm.name.toLowerCase().includes(q) ||
          perm.codename.toLowerCase().includes(q)
      );

      if (matchingPermissions.length === 0) return null;

      return {
        ...group,
        permissions: matchingPermissions,
      };
    })
    .filter(Boolean);
}
