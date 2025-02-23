import React from "react";
import { AlertTriangle, Computer, User, UserCog } from "lucide-react";

interface EntityHeaderProps {
  totalEntities: number;
  isLoading: boolean;
  type: "users-origin" | "users-impacted" | "computers";
}

const EntityHeader = ({ totalEntities, isLoading, type }: EntityHeaderProps) => {
  const getHeaderContent = () => {
    switch (type) {
      case "users-origin":
        return {
          icon: <User className="h-5 w-5 text-blue-400" />,
          title: "Active Users Origin"
        };
      case "users-impacted":
        return {
          icon: <UserCog className="h-5 w-5 text-blue-400" />,
          title: "Active Users Impacted"
        };
      case "computers":
        return {
          icon: <Computer className="h-5 w-5 text-blue-400" />,
          title: "Active Computers"
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-blue-400" />,
          title: "Active Entities"
        };
    }
  };

  const { icon, title } = getHeaderContent();

  return (
    <div className="flex items-center justify-between bg-[#0A0B0F]/80 p-4 rounded-lg backdrop-blur-sm border border-blue-500/10">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-base font-medium text-gray-200">
          {title}
        </span>
      </div>
      <span className="text-sm font-medium text-blue-400">
        {isLoading ? "Loading..." : `${totalEntities} active`}
      </span>
    </div>
  );
};

export default EntityHeader;