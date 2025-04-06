
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [cameraAccess, setCameraAccess] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const navigate = useNavigate();
  
  const handleNext = () => {
    navigate("/");
  };
  
  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="page-container flex flex-col h-screen animate-fade-in">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png" 
            alt="Onboarding illustration" 
            className="mx-auto h-64 object-contain"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-4">Let's get started!</h1>
        <p className="text-center text-grey-500 mb-8">
          We need to access your camera to identify plants. We also recommend enabling 
          notifications so we can keep you updated on your plants and the community.
        </p>
        
        {/* Permission Toggles */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-grey-200">
            <div>
              <h3 className="font-medium">Camera</h3>
              <p className="text-xs text-grey-500">Access camera for plant identification</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={cameraAccess} 
                onChange={() => setCameraAccess(!cameraAccess)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plant-green"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-grey-200">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-xs text-grey-500">Keep you updated on your plants and the community</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications} 
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-plant-green"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mb-8 space-y-4">
        <button onClick={handleNext} className="btn-primary w-full">
          Next
        </button>
        <button onClick={handleSkip} className="btn-secondary w-full">
          Not now
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
