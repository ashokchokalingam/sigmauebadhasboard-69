import React from "react";
import { AlertTriangle, Computer } from "lucide-react";

interface EntityHeaderProps {
  totalEntities: number;
  isLoading: boolean;
  type: "computers" | "users";
}

const EntityHeader = ({ totalEntities, isLoading, type }: EntityHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-[#1e2c3d]/60 p-4 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {type === "computers" ? (
          <Computer className="h-5 w-5 text-blue-400/80" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-blue-400/80" />
        )}
        <span className="text-lg font-semibold text-blue-100/90">
          {type === "computers" ? "Active Computers" : "Active Users"}
        </span>
      </div>
      <span className="text-sm font-medium text-blue-400/80">
        {isLoading ? "Loading..." : `${totalEntities.toLocaleString()} active`}
      </span>
    </div>
  );
};

export default EntityHeader;