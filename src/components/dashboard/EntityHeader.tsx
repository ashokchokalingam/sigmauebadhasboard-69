import React from "react";
import { AlertTriangle } from "lucide-react";

interface EntityHeaderProps {
  totalEntities: number;
  isLoading: boolean;
}

const EntityHeader = ({ totalEntities, isLoading }: EntityHeaderProps) => {
  return (
    <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 p-4 rounded-lg backdrop-blur-sm border border-purple-500/20">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-purple-400" />
        <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
          Shadow Warriors
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-purple-500/20 rounded-full text-sm font-semibold text-purple-300 border border-purple-500/30">
          {isLoading ? "Loading..." : `${totalEntities} active`}
        </span>
      </div>
    </h3>
  );
};

export default EntityHeader;