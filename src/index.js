import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './i18n';
import { applyAppearance, loadAppearance } from './utils/theme';
import { seedCredentials } from './utils/auth';
import App from './App';

applyAppearance(loadAppearance());

seedCredentials();

createRoot(document.getElementById('root')).render(<App />);