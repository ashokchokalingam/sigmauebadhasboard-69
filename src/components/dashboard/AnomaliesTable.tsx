import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Alert, AnomaliesTableProps } from "./types";
import AlertTableRow from "./AlertTableRow";
import AlertDetailsPanel from "./AlertDetailsPanel";
import TimelineView from "./TimelineView";

interface TimelineState {
  type: "user" | "computer";
  id: string;
}

const AnomaliesTable = ({ alerts }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [timelineView, setTimelineView] = useState<TimelineState | null>(null);
  
  const sortedAlerts = [...alerts]
    .sort((a, b) => getRiskScore(b) - getRiskScore(a))
    .slice(0, 10);

  const toggleAlert = (alert: Alert) => {
    setSelectedAlert(selectedAlert?.id === alert.id ? null : alert);
  };

  const handleTimelineView = (type: "user" | "computer", id: string) => {
    setTimelineView({ type, id });
  };

  return (
    <div className="relative flex gap-4">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300 flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            Latest Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-blue-500/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-blue-950/30">
                  <TableHead className="text-blue-300">Time</TableHead>
                  <TableHead className="text-blue-300">User</TableHead>
                  <TableHead className="text-blue-300">Computer</TableHead>
                  <TableHead className="text-blue-300">Title</TableHead>
                  <TableHead className="text-blue-300">Tactics</TableHead>
                  <TableHead className="text-blue-300">Techniques</TableHead>
                  <TableHead className="text-blue-300">Risk Score</TableHead>
                  <TableHead className="text-blue-300">Outlier</TableHead>
                  <TableHead className="text-blue-300 w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAlerts.map((alert) => (
                  <AlertTableRow
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlert?.id === alert.id}
                    onToggle={() => toggleAlert(alert)}
                    onTimelineView={handleTimelineView}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetailsPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {timelineView && (
        <TimelineView
          alerts={alerts}
          entityType={timelineView.type}
          entityId={timelineView.id}
          onClose={() => setTimelineView(null)}
        />
      )}
    </div>
  );
};

export default AnomaliesTable;