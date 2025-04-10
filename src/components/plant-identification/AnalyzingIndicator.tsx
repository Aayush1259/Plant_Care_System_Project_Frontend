
import React from "react";
import { RefreshCw } from "lucide-react";

const AnalyzingIndicator: React.FC = () => {
  return (
    <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
      <div className="flex flex-col items-center">
        <RefreshCw size={48} className="text-grey-400 animate-spin" />
        <p className="mt-2 text-grey-500">Identifying plant...</p>
      </div>
    </div>
  );
};

export default AnalyzingIndicator;
