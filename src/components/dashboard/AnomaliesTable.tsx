import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Alert } from "./types";
import DetailsSidebar from "./DetailsSidebar";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import { useToast } from "../ui/use-toast";
import ColumnSelector from "./ColumnSelector";
import TableHeaderComponent from "./TableHeader";
import AlertTableRow from "./TableRow";
import { defaultColumns } from "./TableConfig";

interface TimelineState {
  type: "user" | "computer";
  id: string;
}

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [timelineView, setTimelineView] = useState<TimelineState | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultColumns.map(col => col.key)
  );
  const { toast } = useToast();
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const sortedAlerts = [...alerts]
    .filter(alert => {
      const alertDate = new Date(alert.system_time);
      return alertDate >= sevenDaysAgo;
    })
    .sort((a, b) => 
      new Date(b.system_time).getTime() - new Date(a.system_time).getTime()
    )
    .slice(0, 1000);

  const filteredAlerts = sortedAlerts.filter(alert => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === "tags") {
        return alert[key].toLowerCase().includes(value.toLowerCase());
      }
      if (key === "system_time") {
        const alertTime = new Date(alert[key]).toLocaleTimeString();
        return alertTime === value;
      }
      return String(alert[key as keyof Alert]).toLowerCase() === value.toLowerCase();
    });
  }).slice(0, ALERTS_PER_PAGE);

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev => {
      const newColumns = prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey];
      
      toast({
        title: prev.includes(columnKey) ? "Column Hidden" : "Column Shown",
        description: `${defaultColumns.find(col => col.key === columnKey)?.label} column has been ${prev.includes(columnKey) ? "hidden" : "shown"}`,
      });
      
      return newColumns;
    });
  };

  const toggleAlert = (alert: Alert) => {
    if (selectedAlert?.id === alert.id) {
      setSelectedAlert(null);
      setTimelineView(null);
      window.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      setSelectedAlert(alert);
      setTimelineView(null);
      setTimeout(() => {
        window.scrollTo({
          left: document.documentElement.scrollWidth,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    if (timelineView?.type === type && timelineView?.id === id) {
      setTimelineView(null);
    } else {
      setSelectedAlert(null);
      setTimelineView({ type, id });
    }
  };

  return (
    <div className="relative flex gap-4">
      <Card className={`bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300 ${selectedAlert || timelineView ? 'flex-[0.6]' : 'flex-1'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2 text-blue-100">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                Recent Events - Last 7 Days (Limited to 1000)
              </CardTitle>
              <ColumnSelector
                columns={defaultColumns}
                visibleColumns={visibleColumns}
                onColumnToggle={handleColumnToggle}
              />
            </div>
            {Object.keys(filters).some(key => filters[key]) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({});
                  toast({
                    title: "Filters Cleared",
                    description: "Showing all events from the last 7 days",
                  });
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-500/10">
            <Table>
              <TableHeaderComponent 
                alerts={alerts}
                onFilterChange={(column, value) => {
                  setFilters(prev => ({
                    ...prev,
                    [column]: value
                  }));
                }}
                filters={filters}
                visibleColumns={visibleColumns}
              />
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <AlertTableRow
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlert?.id === alert.id}
                    onToggle={() => toggleAlert(alert)}
                    onTimelineView={handleTimelineView}
                    visibleColumns={visibleColumns}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {hasMore && filteredAlerts.length >= ALERTS_PER_PAGE && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={onLoadMore}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Load More Events
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <DetailsSidebar
        selectedAlert={selectedAlert}
        timelineView={timelineView}
        alerts={alerts}
        onTimelineClose={() => setTimelineView(null)}
      />
    </div>
  );
};

export default AnomaliesTable;