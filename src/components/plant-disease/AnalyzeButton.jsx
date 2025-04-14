
import React from "react";
import { Button } from "@/components/ui/button";

const AnalyzeButton = ({ onClick, disabled }) => {
  return (
    <Button 
      className="w-full bg-plant-green mt-4" 
      onClick={onClick}
      disabled={disabled}
    >
      Analyze Disease
    </Button>
  );
};

export default AnalyzeButton;
