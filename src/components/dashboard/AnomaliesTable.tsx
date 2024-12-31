import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import AlertTableRow from "./AlertTableRow";
import { defaultColumns } from "./TableConfig";
import AlertDetailsView from "./AlertDetailsView";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  
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

  const filteredAlerts = sortedAlerts.slice(0, ALERTS_PER_PAGE);

  const handleAlertSelect = (alert: Alert, index: number) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
    setSelectedRowIndex(selectedAlert?.id === alert.id ? -1 : index);
  };

  return (
    <div className="space-y-6 relative">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Recent Events - Last 7 Days (Limited to 1000)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div 
              ref={containerRef}
              className="flex-1 table-container rounded-md border border-blue-500/10 overflow-auto max-h-[800px]"
            >
              <div ref={tableRef}>
                <Table>
                  <thead>
                    <tr>
                      {defaultColumns.map(column => (
                        <th key={column.key} className="text-blue-300 px-4 py-2 sticky top-0 bg-black z-10">
                          {column.label}
                        </th>
                      ))}
                      <th className="w-[50px] sticky top-0 bg-black z-10"></th>
                    </tr>
                  </thead>
                  <TableBody className="bg-black/40">
                    {filteredAlerts.map((alert, index) => (
                      <AlertTableRow
                        key={alert.id}
                        alert={alert}
                        isSelected={selectedAlert?.id === alert.id}
                        onToggle={() => handleAlertSelect(alert, index)}
                        onTimelineView={() => {}}
                        visibleColumns={defaultColumns.map(col => col.key)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {selectedAlert && selectedRowIndex >= 0 && (
              <div 
                className="w-[600px] flex-shrink-0 overflow-auto max-h-[800px]"
                style={{
                  marginTop: `${selectedRowIndex * 53}px` // Approximate height of each row
                }}
              >
                <AlertDetailsView
                  alert={selectedAlert}
                  onClose={() => {
                    setSelectedAlert(null);
                    setSelectedRowIndex(-1);
                  }}
                />
              </div>
            )}
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
    </div>
  );
};

export default AnomaliesTable;