import {
  Users, ShieldCheck, KeyRound, UserCheck,
  UserPlus, ShieldPlus, Pencil, LogIn,
  CirclePlus, ListChecks, UserRound,
} from 'lucide-react';

// The four small cards at the top
export const overviewStats = [
  { id: 'users', icon: Users, tone: 'blue', value: '11', label: 'Total Users', change: '+8.2%', trend: 'up' },
  { id: 'roles', icon: ShieldCheck, tone: 'purple', value: '7', label: 'Total Roles', change: '+2', trend: 'up' },
  { id: 'permissions', icon: KeyRound, tone: 'amber', value: '76', label: 'Total Permissions', change: '0%', trend: 'up' },
  { id: 'verified', icon: UserCheck, tone: 'green', value: '11', label: 'Verified Users', change: '-1.4%', trend: 'down' },
];

// "User Growth" line chart (new signups per month)
export const userGrowth = {
  max: 2000,
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  values: [420, 512, 610, 705, 840, 960, 1080, 1248],
};

// "Users by Role" bars
export const usersByRole = [
  { role: 'Editor', count: 61 },
  { role: 'Manager', count: 52 },
  { role: 'Support', count: 34 },
  { role: 'Admin', count: 27 },
  { role: 'Viewer', count: 18 },
];

// "Recent Activity" list. The text is split so the name can be bold.
export const recentActivity = [
  { id: 1, icon: UserPlus, tone: 'green', before: 'New user ', bold: 'John Doe', after: ' registered.', time: '5 mins ago' },
  { id: 2, icon: ShieldPlus, tone: 'purple', before: 'Role ', bold: 'Support', after: ' was created.', time: '32 mins ago' },
  { id: 3, icon: Pencil, tone: 'blue', before: '', bold: 'Emily Carter', after: ' updated her profile.', time: '1 hr ago' },
  { id: 4, icon: LogIn, tone: 'amber', before: '', bold: 'Michael Lee', after: ' signed in from a new device.', time: '2 hrs ago' },
];

// "Quick Actions" links
export const quickActions = [
  { id: 'create-role', icon: CirclePlus, label: 'Create Role', path: '/roles/create/' },
  { id: 'manage-roles', icon: ListChecks, label: 'Manage Roles', path: '/roles/' },
  { id: 'my-profile', icon: UserRound, label: 'My Profile', path: '/settings/' },
  { id: 'change-password', icon: KeyRound, label: 'Change Password', path: '/settings/change-password/' },
];