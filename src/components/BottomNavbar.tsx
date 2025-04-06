
import { Home, Search, Leaf, MessageSquare, User, BrainCircuit } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNavbar() {
  const location = useLocation();

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-grey-200 bg-white py-2 px-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/" className="flex flex-col items-center space-y-1">
          <Home size={20} className={`${isActiveRoute('/') ? 'text-plant-green' : 'text-grey-500'}`} />
          <span className={`text-xs ${isActiveRoute('/') ? 'text-plant-green' : 'text-grey-500'}`}>Home</span>
        </Link>
        <Link to="/garden" className="flex flex-col items-center space-y-1">
          <Leaf size={20} className={`${isActiveRoute('/garden') ? 'text-plant-green' : 'text-grey-500'}`} />
          <span className={`text-xs ${isActiveRoute('/garden') ? 'text-plant-green' : 'text-grey-500'}`}>Garden</span>
        </Link>
        <Link to="/community" className="flex flex-col items-center space-y-1">
          <MessageSquare size={20} className={`${isActiveRoute('/community') ? 'text-plant-green' : 'text-grey-500'}`} />
          <span className={`text-xs ${isActiveRoute('/community') ? 'text-plant-green' : 'text-grey-500'}`}>Community</span>
        </Link>
        <Link to="/green-ai" className="flex flex-col items-center space-y-1">
          <BrainCircuit size={20} className={`${isActiveRoute('/green-ai') ? 'text-plant-green' : 'text-grey-500'}`} />
          <span className={`text-xs ${isActiveRoute('/green-ai') ? 'text-plant-green' : 'text-grey-500'}`}>Green AI</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center space-y-1">
          <User size={20} className={`${isActiveRoute('/profile') ? 'text-plant-green' : 'text-grey-500'}`} />
          <span className={`text-xs ${isActiveRoute('/profile') ? 'text-plant-green' : 'text-grey-500'}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
}
