import { createRoot } from 'react-dom/client';
import '@fontsource/spectral/400.css';
import '@fontsource/spectral/600.css';
import '@fontsource/cinzel/400.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import './index.css';
import './styles/base.css';
import './styles/scenes.css';
import './styles/landing.css';
import './styles/forms.css';
import './styles/stage.css';
import './styles/result.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <App />
);
