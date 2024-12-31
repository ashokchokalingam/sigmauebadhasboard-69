import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import { useToast } from "../ui/use-toast";
import ColumnSelector from "./ColumnSelector";
import TableHeaderComponent from "./TableHeader";
import AlertTableRow from "./TableRow";
import { allColumns, defaultVisibleColumns } from "./TableConfig";
import AlertDetailsView from "./AlertDetailsView";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);
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

  const handleColumnToggle = (newColumns: string[]) => {
    if (newColumns.length === 0) {
      toast({
        title: "Error",
        description: "At least one column must be visible",
        variant: "destructive",
      });
      return;
    }
    setVisibleColumns(newColumns);
    toast({
      title: "Columns Updated",
      description: "The visible columns have been updated",
    });
  };

  const handleColumnOrderChange = (newOrder: string[]) => {
    setVisibleColumns(newOrder);
    toast({
      title: "Column Order Updated",
      description: "The columns have been reordered",
    });
  };

  const selectedAlert = alerts.find(alert => alert.id === selectedAlertId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr,auto] gap-6">
        <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2 text-blue-100">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  Recent Events - Last 7 Days (Limited to 1000)
                </CardTitle>
                <ColumnSelector
                  columns={allColumns}
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
            <div className="table-container rounded-md border border-blue-500/10">
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
                  onColumnOrderChange={handleColumnOrderChange}
                />
                <TableBody className="bg-black/40">
                  {filteredAlerts.map((alert) => (
                    <AlertTableRow
                      key={alert.id}
                      alert={alert}
                      isSelected={selectedAlertId === alert.id}
                      onToggle={() => setSelectedAlertId(selectedAlertId === alert.id ? null : alert.id)}
                      onTimelineView={() => {}} // Implement if needed
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

        {selectedAlert && (
          <Card className="bg-black/40 border-blue-500/10 w-[600px] sticky top-6">
            <CardContent className="p-6">
              <AlertDetailsView alert={selectedAlert} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnomaliesTable;