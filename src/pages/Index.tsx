
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PlantCard from "@/components/PlantCard";
import BottomNavbar from "@/components/BottomNavbar";

// Sample plant data for the recent scans section
const recentPlants = [
  { id: "1", name: "Pothos", image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", daysAgo: 2 },
  { id: "2", name: "Cactus", image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", daysAgo: 3 },
  { id: "3", name: "Monstera", image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", daysAgo: 4 },
  { id: "4", name: "Fiddle Leaf Fig", image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", daysAgo: 5 }
];

const Index = () => {
  return (
    <div className="page-container pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plant Care System</h1>
        <Link to="/search">
          <Search className="text-gray-500" size={22} />
        </Link>
      </div>
      
      {/* Upload Photo Button */}
      <Link to="/plant-id">
        <div className="bg-white flex justify-between items-center rounded-lg mt-6 p-4 border border-grey-200">
          <span className="text-sm font-medium">Upload a photo</span>
          <ArrowRight size={16} className="text-grey-500" />
        </div>
      </Link>
      
      {/* Recent Scans Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
        <div className="grid grid-cols-2 gap-4">
          {recentPlants.map(plant => (
            <PlantCard 
              key={plant.id}
              id={plant.id}
              name={plant.name}
              image={plant.image}
              daysAgo={plant.daysAgo}
            />
          ))}
        </div>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Index;
