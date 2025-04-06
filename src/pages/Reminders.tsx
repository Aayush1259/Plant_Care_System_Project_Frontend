
import Header from "@/components/Header";
import { PlusCircle } from "lucide-react";

interface ReminderProps {
  title: string;
  description: string;
  time: string;
}

const Reminder = ({ title, description, time }: ReminderProps) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-grey-200">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-grey-500">{description}</p>
      </div>
      <p className="text-sm text-grey-500">{time}</p>
    </div>
  );
};

const Reminders = () => {
  const todayReminders: ReminderProps[] = [
    {
      title: "Water the money tree",
      description: "Every 2 weeks",
      time: "1:30PM"
    }
  ];

  const tomorrowReminders: ReminderProps[] = [
    {
      title: "Fertilize the fiddle leaf fig",
      description: "Once a month",
      time: "9:00AM"
    },
    {
      title: "Rotate plants",
      description: "Every 3 months",
      time: "6:00PM"
    }
  ];

  return (
    <div className="page-container animate-fade-in">
      <Header showBack title="Reminders" />
      
      {/* Today's Reminders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Today</h2>
        {todayReminders.map((reminder, index) => (
          <Reminder key={index} {...reminder} />
        ))}
      </div>
      
      {/* Tomorrow's Reminders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tomorrow</h2>
        {tomorrowReminders.map((reminder, index) => (
          <Reminder key={index} {...reminder} />
        ))}
      </div>
      
      {/* Add Reminder Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <button className="btn-primary w-full flex items-center justify-center">
          <PlusCircle size={18} className="mr-2" />
          Add Reminder
        </button>
      </div>
    </div>
  );
};

export default Reminders;
