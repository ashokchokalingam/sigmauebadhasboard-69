import React from "react";
import { AlertTriangle, Computer, User } from "lucide-react";

interface EntityHeaderProps {
  totalEntities: number;
  isLoading: boolean;
  type: "computers" | "users";
}

const EntityHeader = ({ totalEntities, isLoading, type }: EntityHeaderProps) => {
  return (
    <h3 className="text-xl font-bold text-blue-100 mb-4 flex items-center justify-between bg-gradient-to-r from-[#243949] to-[#517fa4] p-4 rounded-lg backdrop-blur-sm border border-blue-500/20">
      <div className="flex items-center gap-2">
        {type === "computers" ? (
          <Computer className="h-5 w-5 text-blue-400" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-blue-400" />
        )}
        <span className="bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
          {type === "computers" ? "Active Computers" : "Active Users"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm font-semibold text-blue-300 border border-blue-500/30">
          {isLoading ? "Loading..." : `${totalEntities} active`}
        </span>
      </div>
    </h3>
  );
};

export default EntityHeader;