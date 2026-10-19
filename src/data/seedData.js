
export const profileSeed = {
  name: 'Syed Sadman Salahuddin',
  username: 'superuser',
  email: 'superuser@test.com',
  phone: '+8801500000001',
  gender: 'Male',
  dateOfBirth: 'Oct 19, 2002',
  age: '24',
  religion: 'Islam',
  roles: ['HR & Admin'],
  joined: 'Sep 17, 2026, 02:47 PM',
  lastUpdated: 'Oct 19, 2026, 02:27 PM',
  lastActive: 'Oct 19, 2026, 02:27 PM',
  status: {
    active: true,
    admin: true,
    superuser: true,
    verified: true,
    emailVerified: true,
    phoneVerified: true,
  },
};

export const dashboardSeed = {
  stats: [
    { id: 'users', value: '11', change: '+8.2%', trend: 'up' },
    { id: 'roles', value: '7', change: '+2', trend: 'up' },
    { id: 'permissions', value: '76', change: '0%', trend: 'up' },
    { id: 'verified', value: '11', change: '-1.4%', trend: 'down' },
  ],

  userGrowth: {
    max: 2000,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    values: [420, 512, 610, 705, 840, 960, 1080, 1248],
  },

  usersByRole: [
    { role: 'Editor', count: 61 },
    { role: 'Manager', count: 52 },
    { role: 'Support', count: 34 },
    { role: 'Admin', count: 27 },
    { role: 'Viewer', count: 18 },
  ],

  recentActivity: [
    { id: 1, type: 'user_registered', name: 'John Doe', time: '5 mins ago' },
    { id: 2, type: 'role_created', name: 'Support', time: '32 mins ago' },
    { id: 3, type: 'profile_updated', name: 'Emily Carter', time: '1 hr ago' },
    { id: 4, type: 'signed_in', name: 'Michael Lee', time: '2 hrs ago' },
  ],
};