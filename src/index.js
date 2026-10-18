import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { applyAppearance, loadAppearance } from './utils/theme';
import App from './App';

// Apply saved colour/dark-mode BEFORE React renders, so there is no flash.
applyAppearance(loadAppearance());

createRoot(document.getElementById('root')).render(<App />);