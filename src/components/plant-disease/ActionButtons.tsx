
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  selectedImage: string | null;
  result: any;
  analyzing: boolean;
  onAnalyze: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedImage,
  result,
  analyzing,
  onAnalyze,
  onReset,
}) => {
  const { toast } = useToast();

  // If there's no selected image or we're analyzing/have results, don't show analyze button
  if (!selectedImage || analyzing || result) {
    return null;
  }
  
  return (
    <Button 
      className="w-full bg-plant-green mt-4" 
      onClick={onAnalyze}
      disabled={analyzing}
    >
      Analyze Disease
    </Button>
  );
};

export default ActionButtons;
