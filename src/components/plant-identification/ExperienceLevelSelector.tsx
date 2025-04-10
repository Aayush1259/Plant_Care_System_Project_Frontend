
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExperienceLevelSelectorProps {
  experienceLevel: "beginner" | "hobbyist" | "expert";
  onExperienceLevelChange: (value: "beginner" | "hobbyist" | "expert") => void;
}

const ExperienceLevelSelector: React.FC<ExperienceLevelSelectorProps> = ({
  experienceLevel,
  onExperienceLevelChange,
}) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500 mb-2">Choose your plant knowledge level:</p>
      <Select
        value={experienceLevel}
        onValueChange={(value) => onExperienceLevelChange(value as "beginner" | "hobbyist" | "expert")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select experience level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="hobbyist">Hobbyist</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExperienceLevelSelector;
