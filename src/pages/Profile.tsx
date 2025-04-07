
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Camera } from "lucide-react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Profile" />
      
      {/* User Profile */}
      <div className="flex flex-col items-center mt-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile?.photoURL} alt={userProfile?.name} />
            <AvatarFallback className="text-xl bg-plant-green text-white">
              {userProfile?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Link to="/edit-profile" className="absolute bottom-0 right-0 bg-plant-green rounded-full p-1">
            <Camera size={16} className="text-white" />
          </Link>
        </div>
        <h2 className="text-xl font-semibold mt-4">{userProfile?.name}</h2>
        <p className="text-grey-500">{userProfile?.email}</p>
        <p className="text-sm text-grey-500 mt-1">Member since {userProfile?.joinedDate}</p>
        
        {/* Stats */}
        <div className="flex justify-around w-full mt-6 border-y border-grey-200 py-4">
          <div className="text-center">
            <p className="font-semibold">{userProfile?.plantsCount || 0}</p>
            <p className="text-sm text-grey-500">Plants</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{userProfile?.postsCount || 0}</p>
            <p className="text-sm text-grey-500">Posts</p>
          </div>
        </div>
      </div>
      
      {/* Menu Options */}
      <div className="mt-6 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start text-left"
          onClick={() => navigate("/edit-profile")}
        >
          <User size={18} className="mr-2" />
          Edit Profile
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left"
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} className="mr-2" />
          Settings
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Profile;
