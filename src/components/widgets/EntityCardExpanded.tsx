
import React from "react";
import { ArrowUpIcon, ArrowDownIcon, Clock } from "lucide-react";
import { RiskyEntity } from "./types";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/dateTimeUtils";

interface EntityCardExpandedProps {
  entity: RiskyEntity;
  trend: 'up' | 'down' | null;
}

const EntityCardExpanded = ({ entity, trend }: EntityCardExpandedProps) => {
  return (
    <div className="px-4 py-3 text-sm text-[#9b87f5]/70">
      <div className="space-y-2">
        <div>
          <div>Unique Tactics: {entity.unique_tactics_count}</div>
          <div>Unique Outliers: {entity.unique_outliers}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Risk Score Trend:</span>
          {trend && (
            <div className={cn(
              "flex items-center gap-1",
              trend === 'up' ? "text-red-400" : "text-green-400"
            )}>
              {trend === 'up' ? (
                <>
                  <ArrowUpIcon className="h-4 w-4" />
                  <span>Increasing</span>
                </>
              ) : (
                <>
                  <ArrowDownIcon className="h-4 w-4" />
                  <span>Decreasing</span>
                </>
              )}
            </div>
          )}
        </div>

        {entity.last_seen && (
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            <span>Last seen: {formatDateTime(entity.last_seen, true)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityCardExpanded;
