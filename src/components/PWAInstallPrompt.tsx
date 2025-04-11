
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Check if the prompt should be shown (not already installed or dismissed)
      const hasUserDismissed = localStorage.getItem('pwaPromptDismissed');
      if (!hasUserDismissed) {
        setIsVisible(true);
      }
    };

    // Check if already installed
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || 
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    checkIsInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
      // Store dismissal in localStorage to not show again for some time
      localStorage.setItem('pwaPromptDismissed', Date.now().toString());
    }

    // Clear the saved prompt
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to not show again for some time
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-16 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-sm">Install Plant Care App</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Install this app on your device for offline use and a better experience.
          </p>
        </div>
        <button 
          onClick={handleDismiss} 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mt-3 flex space-x-2">
        <Button 
          onClick={handleInstallClick} 
          variant="default" 
          className="w-full text-xs bg-plant-green hover:bg-green-600"
        >
          Install App
        </Button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
