
import React from "react";
import { Button } from "@/components/ui/button";

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, disabled }) => {
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
