
import React from "react";
import { RefreshCw } from "lucide-react";

interface AnalyzingIndicatorProps {
  type: "identification" | "disease";
}

const AnalyzingIndicator: React.FC<AnalyzingIndicatorProps> = ({ type }) => {
  const text = type === "identification" ? "Identifying plant..." : "Analyzing plant disease...";
  
  return (
    <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
      <div className="flex flex-col items-center">
        <RefreshCw size={48} className="text-grey-400 animate-spin" />
        <p className="mt-2 text-grey-500">{text}</p>
      </div>
    </div>
  );
};

export default AnalyzingIndicator;
