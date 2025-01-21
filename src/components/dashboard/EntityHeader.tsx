import React from "react";
import { AlertTriangle, Computer, User, UserCog, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          icon: <User className="h-5 w-5 text-dashboard-neutral" />,
          title: "Active Users Origin",
          description: "Users who initiated security events"
        };
      case "users-impacted":
        return {
          icon: <UserCog className="h-5 w-5 text-dashboard-neutral" />,
          title: "Active Users Impacted",
          description: "Users affected by security events"
        };
      case "computers":
        return {
          icon: <Computer className="h-5 w-5 text-dashboard-neutral" />,
          title: "Active Computers",
          description: "Systems involved in security events"
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-dashboard-neutral" />,
          title: "Active Entities",
          description: "All active security entities"
        };
    }
  };

  const { icon, title, description } = getHeaderContent();

  return (
    <div className="bg-gradient-to-r from-dashboard-section-1 to-dashboard-section-2 
                    p-4 rounded-lg backdrop-blur-sm border border-gray-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium text-gray-200">
                {title}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm text-gray-400">
              {isLoading ? "Loading..." : `${totalEntities} active`}
            </span>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-dashboard-neutral/10 rounded-full border border-dashboard-neutral/20">
          <span className="text-sm font-medium text-dashboard-neutral">
            {isLoading ? "..." : totalEntities}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntityHeader;