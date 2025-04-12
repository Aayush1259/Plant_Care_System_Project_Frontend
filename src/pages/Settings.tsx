
import { useNavigate } from "react-router-dom";
import { Bell, Moon, HelpCircle, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";

const Settings = () => {
  const navigate = useNavigate();

  const handleNotificationToggle = (enabled: boolean) => {
    toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    toast.success(`Dark mode ${enabled ? 'enabled' : 'disabled'}`);
    // In a real app, you'd implement theme switching logic here
  };

  return (
    <PageLayout title="Settings" showBack>
      <div className="max-w-md mx-auto mt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span>Push Notifications</span>
                </div>
                <Switch onCheckedChange={handleNotificationToggle} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span>Dark Mode</span>
                </div>
                <Switch onCheckedChange={handleDarkModeToggle} />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-4">Support</h2>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left"
                onClick={() => toast.info("Help center feature coming soon!")}
              >
                <HelpCircle size={18} className="mr-2" />
                Help Center
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left"
                onClick={() => toast.info("Privacy feature coming soon!")}
              >
                <Shield size={18} className="mr-2" />
                Privacy Policy
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-left"
                onClick={() => toast.info("Terms feature coming soon!")}
              >
                <Globe size={18} className="mr-2" />
                Terms of Service
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="text-lg font-medium mb-4">About</h2>
            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-medium">Plant Care System</h3>
              <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
              <p className="text-xs text-gray-400 mt-2">© 2025 Plant Care System</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
