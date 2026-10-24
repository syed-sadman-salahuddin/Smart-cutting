import { KeyRound, Shield } from 'lucide-react';

export const securityOptions = [
  { id: 'changePassword', icon: KeyRound, tone: 'blue', path: '/settings/change-password/' },
  { id: 'twoFactor', icon: Shield, tone: 'purple', path: null },
];

export const securityTipIds = ['enable2fa', 'uniquePassword', 'signOut', 'noSharing'];