import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "./types";
import { defaultColumns } from "./TableConfig";
import { useAlertsFilter } from "./hooks/useAlertsFilter";
import EventCard from "./EventCard";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map((col) => col.key)
  );

  const { filters, filteredAlerts, handleFilterChange } = useAlertsFilter(alerts);

  return (
    <Card className="relative border-blue-500/10">
      <CardContent className="p-4 space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-[#1a2234] border border-slate-700/50 hover:bg-[#1e2943] transition-all duration-300 rounded-lg p-4"
            onClick={() => setSelectedAlert(alert)}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-100">{alert.title}</h3>
                  <p className="text-sm text-blue-300/70 line-clamp-2">
                    {alert.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                    {alert.rule_level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <span className="text-xs text-blue-400">Computer</span>
                  <p className="text-sm text-blue-100">{alert.computer_name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-400">User</span>
                  <p className="text-sm text-blue-100">{alert.user_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-blue-400">Time</span>
                  <p className="text-sm text-blue-100">
                    {new Date(alert.system_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-400">Rule ID</span>
                  <p className="text-sm text-blue-100">{alert.ruleid || 'N/A'}</p>
                </div>
              </div>

              {alert.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {alert.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {hasMore && (
          <button
            onClick={onLoadMore}
            className="w-full py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            Load More
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomaliesTable;