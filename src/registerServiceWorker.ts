
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      // Check if there's a new service worker waiting to activate
      if (registration.waiting) {
        console.log('New service worker waiting to activate');
        // You could notify the user about an update and let them refresh
        notifyUserAboutUpdate();
      }
      
      // Listen for new service workers
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker installed and ready');
            notifyUserAboutUpdate();
          }
        });
      });
      
      console.log('Service worker registered successfully');
    } catch (error) {
      console.error(`Service worker registration failed: ${error}`);
    }
    
    // Handle updates when the controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker activated');
    });
  } else {
    console.log('Service workers not supported in this browser');
  }
};

// Function to notify users about an update
const notifyUserAboutUpdate = () => {
  // This could be improved to show an actual UI notification
  console.log('A new version of the app is available. Refresh to update.');
  // You could dispatch an event or use a state management solution to show a toast
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Check for app updates periodically
export const checkForUpdates = (): void => {
  setInterval(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.update();
      }
    }
  }, 60 * 60 * 1000); // Check every hour
};

// Monitor network status
export const setupNetworkStatusMonitoring = (): void => {
  window.addEventListener('online', () => {
    console.log('App is online');
    // You could trigger sync operations here
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline');
    // You could show a notification or change UI state
  });
};
