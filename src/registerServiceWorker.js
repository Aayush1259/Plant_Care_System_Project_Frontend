
// Service worker registration and management

/**
 * Register the service worker for PWA functionality
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.info('Service worker registered successfully', registration.scope);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    });
  } else {
    console.info('Service workers are not supported in this browser');
  }
}

/**
 * Set up network status monitoring
 */
export function setupNetworkStatusMonitoring() {
  const updateNetworkStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle('offline-mode', !isOnline);
    
    // You could dispatch custom events or update a global state here
    if (!isOnline) {
      console.warn('Application is offline. Some features may be limited.');
    }
  };
  
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Initial check
  updateNetworkStatus();
}

/**
 * Check for app updates periodically
 */
export function checkForUpdates() {
  const CHECK_INTERVAL = 60 * 60 * 1000; // Every hour
  
  const checkForUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.update();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  };
  
  // Initial check after 10 seconds
  setTimeout(checkForUpdate, 10000);
  
  // Then regular interval checks
  setInterval(checkForUpdate, CHECK_INTERVAL);
}
