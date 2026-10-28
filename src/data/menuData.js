import {
  LayoutDashboard,
  Box,
  ShieldCheck,
  Users,
  Layers,
  FileText,
  Download,
} from 'lucide-react';

export const menuGroups = [
  {
    title: 'Workspace',
    items: [{ id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' }],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'role-and-permissions',
        label: 'Role & Permissions',
        icon: ShieldCheck,
        children: [
          { label: 'Roles', path: '/roles/' },
          { label: 'Permissions', path: '/roles/permissions/' },
        ],
      },
      {
        id: 'human-resource',
        label: 'Human Resource (HR)',
        icon: Users,
        children: [
          { label: 'Companies', path: '/company/list/' },
          { label: 'Departments', path: '/company/department/' },
          { label: 'Designations', path: '/company/designation/' },
          { label: 'Employees', path: '/employee/' },
        ],
      },
    ],
  },
  {
    title: 'General',
    items: [
      {
        id: 'general',
        label: 'General',
        icon: Layers,
        children: [
          { label: 'Parts', path: '/general/part/' },
          { label: 'Shades', path: '/general/shade/' },
          { label: 'Groups', path: '/general/group/' },
          { label: 'Cutting Tables', path: '/general/table/' },
          { label: 'Sewing Lines', path: '/general/line/' },
          { label: 'Buyers', path: '/po/buyer/' },
          { label: 'Our References', path: '/po/our-reference/' },
          { label: 'Purchase Orders', path: '/po/purchase-order/' },
          { label: 'Colors', path: '/po/color/' },
          { label: 'Sizes', path: '/po/size/' },
        ],
      },
    ],
  },
  {
    title: 'Cutting',
    items: [
      {
        id: 'cutting',
        label: 'Cutting',
        icon: FileText,
        children: [
          { label: 'PO List', path: '/cutting/po/' },
          { label: 'Bundle Card (Single PO)', path: '/cutting/bundle-card/single-po/create/' },
          { label: 'Bundle Card (Multi PO)', path: '/cutting/bundle-card/multi-po/create/' },
          { label: 'Bundles List', path: '/cutting/bundle-card/' },
        ],
      },
    ],
  },
  {
    title: 'History',
    items: [{ id: 'download-history', label: 'Download History', icon: Download, path: '/download/' }],
  },
];