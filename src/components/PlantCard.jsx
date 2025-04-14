
import { Link } from "react-router-dom";

export default function PlantCard({ id, name, image, daysAgo }) {
  return (
    <Link to={`/plants/${id}`}>
      <div className="plant-card card-hover">
        <div className="h-32 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-2 text-left">
          <p className="text-xs text-grey-500">{daysAgo} days ago</p>
          <p className="text-sm font-medium">{name}</p>
        </div>
      </div>
    </Link>
  );
}
