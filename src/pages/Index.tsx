
import { Link } from "react-router-dom";
import { Camera, Leaf, Unplug, MessageSquare, Bell } from "lucide-react";
import BottomNavbar from "@/components/BottomNavbar";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const Index = () => {
  const features = [
    {
      id: "plant-id",
      title: "Plant Identification",
      description: "Identify any plant from a photo",
      icon: <Camera className="w-10 h-10 text-plant-green" />,
      path: "/plant-id"
    },
    {
      id: "disease-detection",
      title: "Disease Detection",
      description: "Detect plant diseases and get treatment advice",
      icon: <Unplug className="w-10 h-10 text-plant-green" />,
      path: "/plant-disease"
    },
    {
      id: "community",
      title: "Green Community",
      description: "Connect with other plant enthusiasts",
      icon: <MessageSquare className="w-10 h-10 text-plant-green" />,
      path: "/community"
    },
    {
      id: "my-garden",
      title: "My Garden",
      description: "Track and manage your plant collection",
      icon: <Leaf className="w-10 h-10 text-plant-green" />,
      path: "/garden"
    }
  ];

  return (
    <div className="page-container pb-20 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Plant Care System</h1>
        <Link to="/reminders" className="p-2">
          <Bell size={24} className="text-plant-green" />
        </Link>
      </div>
      
      {/* Hero Section */}
      <div className="mt-4 rounded-lg overflow-hidden relative h-40">
        <img 
          src="/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png" 
          alt="Plants" 
          className="w-full h-full object-cover brightness-[0.8]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 bg-black bg-opacity-30">
          <h1 className="text-xl font-bold">Welcome to Plant Care</h1>
          <p className="text-sm mt-2 text-center">Your smart companion for plant identification and care</p>
        </div>
      </div>
      
      {/* Main Features Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-2 gap-4">
          {features.map(feature => (
            <Link to={feature.path} key={feature.id}>
              <Card className="h-full hover:shadow-md transition-shadow border-grey-200">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="mb-3 mt-2">{feature.icon}</div>
                  <CardTitle className="text-sm font-medium">{feature.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Index;
