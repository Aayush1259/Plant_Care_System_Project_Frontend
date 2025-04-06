
import { useState } from "react";
import { User, Settings, LogOut, Camera } from "lucide-react";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "",
    joinedDate: "January 2023",
    plantsCount: 8,
    postsCount: 12
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Profile" />
      
      {isLoggedIn ? (
        <>
          {/* User Profile */}
          <div className="flex flex-col items-center mt-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl bg-plant-green text-white">{user.name[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-plant-green rounded-full p-1">
                <Camera size={16} className="text-white" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
            <p className="text-grey-500">{user.email}</p>
            <p className="text-sm text-grey-500 mt-1">Member since {user.joinedDate}</p>
            
            {/* Stats */}
            <div className="flex justify-around w-full mt-6 border-y border-grey-200 py-4">
              <div className="text-center">
                <p className="font-semibold">{user.plantsCount}</p>
                <p className="text-sm text-grey-500">Plants</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{user.postsCount}</p>
                <p className="text-sm text-grey-500">Posts</p>
              </div>
            </div>
          </div>
          
          {/* Menu Options */}
          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full justify-start text-left">
              <User size={18} className="mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
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
        </>
      ) : (
        // Login Form
        <div className="flex flex-col items-center justify-center mt-10">
          <Avatar className="h-20 w-20 mb-6">
            <AvatarFallback className="bg-plant-green text-white">
              <User size={32} />
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold mb-6">Login to Your Account</h2>
          
          <form className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border border-grey-200 rounded-md"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                className="w-full p-2 border border-grey-200 rounded-md"
                placeholder="Enter your password"
              />
            </div>
            
            <Button 
              className="w-full bg-plant-green" 
              type="button"
              onClick={handleLogin}
            >
              Login
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-grey-500">
                Don't have an account? <a href="#" className="text-plant-green font-medium">Sign up</a>
              </p>
            </div>
          </form>
        </div>
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default Profile;
