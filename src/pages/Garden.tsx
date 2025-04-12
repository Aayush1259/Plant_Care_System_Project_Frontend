
import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

interface GardenPlant {
  id: string;
  name: string;
  image: string;
  daysAgo: number;
  lastWatered: string;
  nextWatering: string;
}

const Garden = () => {
  const [plants, setPlants] = useState<GardenPlant[]>([
    { 
      id: "1", 
      name: "Monstera", 
      image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", 
      daysAgo: 2,
      lastWatered: "2 days ago",
      nextWatering: "In 5 days"
    },
    { 
      id: "2", 
      name: "Fiddle Leaf Fig", 
      image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", 
      daysAgo: 5,
      lastWatered: "4 days ago",
      nextWatering: "Tomorrow"
    },
    { 
      id: "3", 
      name: "Snake Plant", 
      image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png", 
      daysAgo: 10,
      lastWatered: "10 days ago",
      nextWatering: "In 4 days"
    }
  ]);

  return (
    <PageLayout title="My Garden">
      {plants.length > 0 ? (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Plants</h2>
            <Link to="/add-plant">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus size={16} />
                <span>Add Plant</span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {plants.map(plant => (
              <div key={plant.id} className="flex flex-col">
                <PlantCard
                  id={plant.id}
                  name={plant.name}
                  image={plant.image}
                  daysAgo={plant.daysAgo}
                />
                <div className="mt-1 text-xs text-grey-500">
                  <div>Last watered: {plant.lastWatered}</div>
                  <div>Next watering: {plant.nextWatering}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 mt-8">
          <p className="text-grey-500 mb-4">You haven't added any plants yet</p>
          <Link to="/add-plant">
            <Button className="bg-plant-green">Add Your First Plant</Button>
          </Link>
        </div>
      )}
    </PageLayout>
  );
};

export default Garden;
