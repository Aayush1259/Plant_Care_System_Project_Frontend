
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, setupNetworkStatusMonitoring, checkForUpdates } from './registerServiceWorker'

// Register service worker for PWA functionality
registerServiceWorker();

// Monitor network status for online/offline detection
setupNetworkStatusMonitoring();

// Setup periodic checks for app updates
checkForUpdates();

createRoot(document.getElementById("root")!).render(<App />);
