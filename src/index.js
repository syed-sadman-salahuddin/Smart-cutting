import { createRoot } from 'react-dom/client';
import './styles/global.css';
import './translations/i18n'; // must load before the app: sets up the English / Bangla texts
import { applyAppearance, loadAppearance } from './utils/theme';
import { initDatabase } from './services/database';
import App from './App';

applyAppearance(loadAppearance());

initDatabase();

createRoot(document.getElementById('root')).render(<App />);