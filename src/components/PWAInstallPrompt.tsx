
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const { toast } = useToast();

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67+ from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Check if the prompt should be shown (not already dismissed within 7 days)
      const hasUserDismissed = localStorage.getItem('pwaPromptDismissed');
      const dismissedTime = hasUserDismissed ? parseInt(hasUserDismissed, 10) : 0;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (!hasUserDismissed || (Date.now() - dismissedTime > sevenDays)) {
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
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      toast({
        title: "App installed successfully!",
        description: "Thank you for installing the Plant Care System app.",
        duration: 3000,
      });
    });
    checkIsInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      // Show manual instructions if browser doesn't support automatic installation
      setShowManualInstructions(true);
      return;
    }

    // Show the prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      toast({
        title: "Installation started",
        description: "Plant Care System is being installed on your device.",
        duration: 3000,
      });
    } else {
      console.log('User dismissed the install prompt');
      // Store dismissal in localStorage to not show again for 7 days
      localStorage.setItem('pwaPromptDismissed', Date.now().toString());
      toast({
        title: "Installation cancelled",
        description: "You can install the app later from the app menu.",
        duration: 3000,
      });
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
      
      {showManualInstructions ? (
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <p className="font-medium mb-1">To install manually:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>For iOS: Tap the share button and choose "Add to Home Screen"</li>
            <li>For Android: Tap the menu button and choose "Install App"</li>
            <li>For Desktop: Click the install icon in the address bar</li>
          </ul>
          <button 
            onClick={() => setShowManualInstructions(false)}
            className="mt-2 text-plant-green hover:underline"
          >
            Hide instructions
          </button>
        </div>
      ) : (
        <div className="mt-3 flex space-x-2">
          <Button 
            onClick={handleInstallClick} 
            variant="default" 
            className="w-full text-xs bg-plant-green hover:bg-plant-green/90"
          >
            <Download size={16} className="mr-1.5" /> Install App
          </Button>
          <Button
            onClick={() => setShowManualInstructions(true)}
            variant="outline"
            className="text-xs"
          >
            <Smartphone size={16} className="mr-1.5" /> Instructions
          </Button>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
