// Colour themes copied from the original "Appearance" menu
export const COLOR_THEMES = [
  { id: 'gray', name: 'Neutral Gray', primary: [107, 114, 128], secondary: [75, 85, 99] },
  { id: 'black', name: 'Classic Black', primary: [0, 0, 0], secondary: [31, 31, 31] },
  { id: 'blue', name: 'Ocean Blue', primary: [14, 115, 246], secondary: [0, 82, 204] },
  { id: 'violet', name: 'Deep Violet', primary: [139, 92, 246], secondary: [124, 58, 237] },
  { id: 'rose', name: 'Rose Pink', primary: [232, 93, 138], secondary: [194, 68, 110] },
  { id: 'emerald', name: 'Emerald Green', primary: [16, 185, 129], secondary: [5, 150, 105] },
  { id: 'amber', name: 'Sunset Amber', primary: [245, 158, 11], secondary: [217, 119, 6] },
  { id: 'cyan', name: 'Tropical Cyan', primary: [6, 182, 212], secondary: [8, 145, 178] },
  { id: 'indigo', name: 'Midnight Indigo', primary: [99, 102, 241], secondary: [79, 70, 229] },
  { id: 'red', name: 'Crimson Red', primary: [239, 68, 68], secondary: [220, 38, 38] },
  { id: 'green', name: 'Mint Green', primary: [34, 197, 94], secondary: [22, 163, 74] },
  { id: 'orange', name: 'Vibrant Orange', primary: [249, 115, 22], secondary: [234, 88, 12] },
];

export const ROUNDED_CATEGORIES = [
  { id: 'button', label: 'Button', cssVar: '--rounded-button' },
  { id: 'input', label: 'Input Field', cssVar: '--rounded-input' },
  { id: 'card', label: 'Card', cssVar: '--rounded-card' },
];

export const ROUNDED_OPTIONS = [
  { id: 'none', label: 'Square', value: '0px' },
  { id: 'sm', label: 'Small', value: '0.25rem' },
  { id: 'md', label: 'Medium', value: '0.375rem' },
  { id: 'lg', label: 'Large', value: '0.5rem' },
  { id: 'xl', label: 'Extra Large', value: '0.75rem' },
  { id: '2xl', label: '2XL', value: '1rem' },
  { id: '3xl', label: '3XL', value: '1.5rem' },
  { id: 'full', label: 'Full', value: '9999px' },
];


export const DEFAULT_APPEARANCE = {
  mode: 'light',
  color: 'cyan',
  rounded: { button: 'sm', input: 'sm', card: 'sm' },
};

const STORAGE_KEY = 'st-appearance';

export function loadAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...DEFAULT_APPEARANCE,
      ...saved,
      rounded: { ...DEFAULT_APPEARANCE.rounded, ...(saved.rounded || {}) },
    };
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

export function saveAppearance(appearance) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
  } catch {
    /* storage can be blocked – ignore */
  }
}


export function applyAppearance(appearance) {
  const root = document.documentElement;
  const isDark = appearance.mode === 'dark';
  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);

  const theme = COLOR_THEMES.find((t) => t.id === appearance.color) || COLOR_THEMES[7];
  root.style.setProperty('--color-primary', `rgb(${theme.primary.join(', ')})`);
  root.style.setProperty('--color-secondary', `rgb(${theme.secondary.join(', ')})`);
  root.style.setProperty('--color-primary-rgb', theme.primary.join(' '));
  root.style.setProperty('--color-secondary-rgb', theme.secondary.join(' '));

  ROUNDED_CATEGORIES.forEach((cat) => {
    const option = ROUNDED_OPTIONS.find((o) => o.id === appearance.rounded[cat.id]);
    if (option) root.style.setProperty(cat.cssVar, option.value);
  });
}