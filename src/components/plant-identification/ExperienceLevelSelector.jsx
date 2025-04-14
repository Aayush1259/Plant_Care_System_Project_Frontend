
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ExperienceLevelSelector = ({
  experienceLevel,
  onExperienceLevelChange,
}) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500 mb-2">Choose your plant knowledge level:</p>
      <Select
        value={experienceLevel}
        onValueChange={(value) => onExperienceLevelChange(value)}
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
