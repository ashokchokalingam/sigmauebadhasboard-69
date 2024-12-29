import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ChevronDown, ChevronRight, Terminal, X } from "lucide-react";
import { useState } from "react";
import { Alert, AnomaliesTableProps } from "./types";
import { extractTacticsAndTechniques, getRiskScore, getRiskColor } from "./utils";
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
                {sortedAlerts.map((alert) => {
                  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
                  const isSelected = selectedAlert?.id === alert.id;
                  
                  return (
                    <TableRow 
                      key={alert.id} 
                      className="hover:bg-blue-950/30"
                    >
                      <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
                        {new Date(alert.system_time).toLocaleTimeString()}
                      </TableCell>
                      <TableCell 
                        className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={() => setTimelineView({ type: "user", id: alert.user_id })}
                      >
                        {alert.user_id}
                      </TableCell>
                      <TableCell 
                        className="text-blue-100 whitespace-nowrap cursor-pointer hover:text-blue-400 transition-colors"
                        onClick={() => setTimelineView({ type: "computer", id: alert.computer_name })}
                      >
                        {alert.computer_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-blue-100">{alert.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                          {tactics || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
                          {techniques || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className={`font-mono font-bold ${getRiskColor(getRiskScore(alert))}`}>
                        {getRiskScore(alert).toFixed(1)}
                      </TableCell>
                      <TableCell>
                        {alert.dbscan_cluster === -1 && (
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                            DBSCAN -1
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button 
                          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
                          onClick={() => toggleAlert(alert)}
                        >
                          {isSelected ? (
                            <ChevronDown className="h-4 w-4 text-blue-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-blue-400" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Selected Alert Details Panel */}
      {selectedAlert && (
        <Card className="w-[600px] bg-black/40 border-blue-500/10 h-fit sticky top-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-500" />
              Alert Details
            </CardTitle>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-blue-400" />
            </button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alert Overview Section */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">Alert Overview</h4>
                <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                  <h3 className="text-lg font-semibold text-blue-100 mb-2">{selectedAlert.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
                      {extractTacticsAndTechniques(selectedAlert.tags).tactics || 'No Tactics'}
                    </span>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs rounded-full border border-indigo-500/20">
                      {extractTacticsAndTechniques(selectedAlert.tags).techniques || 'No Techniques'}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                      Rule ID: {selectedAlert.ruleid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Entity Information */}
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">Entity Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">Computer Name</p>
                    <p className="text-blue-100 font-mono">{selectedAlert.computer_name}</p>
                  </div>
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">User ID</p>
                    <p className="text-blue-100 font-mono">{selectedAlert.user_id}</p>
                  </div>
                  {selectedAlert.ip_address && (
                    <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                      <p className="text-sm font-medium text-blue-400 mb-1">IP Address</p>
                      <p className="text-blue-100 font-mono">{selectedAlert.ip_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-2">Event Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">Event ID</p>
                    <p className="text-blue-100 font-mono">{selectedAlert.event_id}</p>
                  </div>
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">Provider Name</p>
                    <p className="text-blue-100">{selectedAlert.provider_name}</p>
                  </div>
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">Task</p>
                    <p className="text-blue-100">{selectedAlert.task}</p>
                  </div>
                  <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10">
                    <p className="text-sm font-medium text-blue-400 mb-1">System Time</p>
                    <p className="text-blue-100 font-mono">
                      {new Date(selectedAlert.system_time).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Raw Data Section */}
            <div>
              <h4 className="text-sm font-medium text-blue-400 mb-2">Raw Event Data</h4>
              <pre className="bg-blue-950/30 p-4 rounded-lg border border-blue-500/10 overflow-x-auto">
                <code className="text-sm font-mono text-blue-100">
                  {JSON.stringify(JSON.parse(selectedAlert.raw), null, 2)}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline View */}
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