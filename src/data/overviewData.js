import {
  Users, ShieldCheck, KeyRound, UserCheck,
  UserPlus, ShieldPlus, Pencil, LogIn,
  CirclePlus, ListChecks, UserRound,
} from 'lucide-react';

export const statConfig = {
  users: { icon: Users, tone: 'blue', label: 'Total Users' },
  roles: { icon: ShieldCheck, tone: 'purple', label: 'Total Roles' },
  permissions: { icon: KeyRound, tone: 'amber', label: 'Total Permissions' },
  verified: { icon: UserCheck, tone: 'green', label: 'Verified Users' },
};

export const activityTypes = {
  user_registered: { icon: UserPlus, tone: 'green', before: 'New user ', after: ' registered.' },
  role_created: { icon: ShieldPlus, tone: 'purple', before: 'Role ', after: ' was created.' },
  profile_updated: { icon: Pencil, tone: 'blue', before: '', after: ' updated her profile.' },
  signed_in: { icon: LogIn, tone: 'amber', before: '', after: ' signed in from a new device.' },
};

export const quickActions = [
  { id: 'create-role', icon: CirclePlus, label: 'Create Role', path: '/roles/create/' },
  { id: 'manage-roles', icon: ListChecks, label: 'Manage Roles', path: '/roles/' },
  { id: 'my-profile', icon: UserRound, label: 'My Profile', path: '/settings/' },
  { id: 'change-password', icon: KeyRound, label: 'Change Password', path: '/settings/change-password/' },
];