import { KEYS } from '../services/storage';
import { profileSeed } from '../data/seedData';
import { useStorage } from './useStorage';


export function useCurrentUser() {
  const [profile, setProfile] = useStorage(KEYS.profile, profileSeed);
  const merged = { ...profileSeed, ...profile };
  const name = merged.name || profileSeed.name;
  return {
    ...merged,
    name,
    initial: name.trim().charAt(0).toUpperCase() || 'S',
    updateProfile: (updates) => {
      return setProfile((prev) => ({ ...(prev || profileSeed), ...updates }));
    },
  };
}
