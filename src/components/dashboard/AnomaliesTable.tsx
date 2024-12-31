import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Alert } from "./types";
import { Button } from "../ui/button";
import { ALERTS_PER_PAGE } from "@/constants/pagination";
import AlertTableRow from "./AlertTableRow";
import { defaultColumns } from "./TableConfig";

interface AnomaliesTableProps {
  alerts: Alert[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const AnomaliesTable = ({ alerts, onLoadMore, hasMore }: AnomaliesTableProps) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  
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

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Recent Events - Last 7 Days (Limited to 1000)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container rounded-md border border-blue-500/10">
            <Table>
              <thead>
                <tr>
                  {defaultColumns.map(column => (
                    <th key={column.key} className="text-blue-300 px-4 py-2">
                      {column.label}
                    </th>
                  ))}
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <TableBody className="bg-black/40">
                {filteredAlerts.map((alert) => (
                  <AlertTableRow
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlertId === alert.id}
                    onToggle={() => setSelectedAlertId(selectedAlertId === alert.id ? null : alert.id)}
                    onTimelineView={() => {}}
                    visibleColumns={defaultColumns.map(col => col.key)}
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
    </div>
  );
};

export default AnomaliesTable;