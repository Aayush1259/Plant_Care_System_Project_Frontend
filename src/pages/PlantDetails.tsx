
import { useParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const PlantDetails = () => {
  const { id } = useParams();
  
  // Mock plant data - in a real app, you'd fetch this based on the ID
  const plant = {
    id: id || "1",
    name: "Fiddle Leaf Fig",
    image: "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    description: "The Fiddle Leaf Fig is a popular indoor plant, known for its large, violin-shaped leaves. It's also notorious for being difficult to care for.",
    careInfo: [
      {
        title: "Water and Light",
        value: "Light: Bright indirect\nWater: Every 1-2 weeks",
        icon: "💧"
      },
      {
        title: "Environment",
        value: "Toxicity: Mildly toxic\nHumidity: Medium",
        icon: "🌱"
      }
    ],
    diseaseAlerts: [
      {
        title: "Leaf Disease",
        issue: "Possible cause: Over-watering",
        symptoms: "Brown spots on leaves",
        status: "Value information"
      },
      {
        title: "Leaf Disease",
        issue: "Possible cause: Under-watering",
        symptoms: "Yellow leaves",
        status: "Health status: Critical"
      }
    ]
  };

  return (
    <PageLayout title={plant.name} showBack>
      {/* Plant Image */}
      <div className="mt-4 rounded-lg overflow-hidden h-64">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Plant Description */}
      <div className="mt-6">
        <p className="text-sm text-grey-500">{plant.description}</p>
      </div>
      
      {/* Care Tips */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Care Tips</h2>
        {plant.careInfo.map((info, index) => (
          <div key={index} className="flex items-start p-4 border-b border-grey-200">
            <div className="mr-4 mt-1">
              <span className="text-xl">{info.icon}</span>
            </div>
            <div>
              <h3 className="font-medium">{info.title}</h3>
              <p className="text-sm text-grey-500 whitespace-pre-line">{info.value}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs text-grey-500">Value text</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Disease Alerts */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Disease Alerts</h2>
        {plant.diseaseAlerts.map((alert, index) => (
          <div key={index} className="flex items-start p-4 border-b border-grey-200">
            <div className="mr-4 mt-1">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-medium">{alert.title}</h3>
              <p className="text-sm text-grey-500">{alert.issue}</p>
              <p className="text-sm text-grey-500">{alert.symptoms}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs text-grey-500">{alert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default PlantDetails;
