import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: number;
  title: string;
  tags: string;
  description: string;
  system_time: string;
  computer_name: string;
  user_id: string;
  event_id: string;
  provider_name: string;
  dbscan_cluster: number;
  raw: string;
  ip_address: string;
  ruleid: string;
  rule_level: string;
  task: string;
}

interface AnomaliesTableProps {
  alerts: Alert[];
}

const getRiskScore = (alert: Alert) => {
  let score = 5; // Base score
  
  // Increase score for critical rules
  if (alert.rule_level === 'critical') score += 3;
  
  // Increase score for outliers
  if (alert.dbscan_cluster === -1) score += 2;
  
  return Math.min(10, score);
};

const getRiskColor = (score: number) => {
  if (score >= 7) return "text-red-500";
  if (score >= 4) return "text-yellow-500";
  return "text-green-500";
};

const AnomaliesTable = ({ alerts }: AnomaliesTableProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const sortedAlerts = [...alerts]
    .sort((a, b) => getRiskScore(b) - getRiskScore(a))
    .slice(0, 10);

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
                  <TableHead className="text-blue-300">Risk Score</TableHead>
                  <TableHead className="text-blue-300">Title</TableHead>
                  <TableHead className="text-blue-300">User</TableHead>
                  <TableHead className="text-blue-300">Computer</TableHead>
                  <TableHead className="text-blue-300">Outlier</TableHead>
                  <TableHead className="text-blue-300">Time</TableHead>
                  <TableHead className="text-blue-300 w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAlerts.map((alert) => (
                  <TableRow 
                    key={alert.id} 
                    className="hover:bg-blue-950/30 cursor-pointer"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <TableCell className={`font-mono font-bold ${getRiskColor(getRiskScore(alert))}`}>
                      {getRiskScore(alert).toFixed(1)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-blue-100">{alert.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-100">{alert.user_id}</TableCell>
                    <TableCell className="text-blue-100">{alert.computer_name}</TableCell>
                    <TableCell>
                      {alert.dbscan_cluster === -1 && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                          DBSCAN -1
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-blue-300 text-sm">
                      {new Date(alert.system_time).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                        <ChevronRight className="h-4 w-4 text-blue-400" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Side Pane for Raw Data */}
      {selectedAlert && (
        <Card className="w-[600px] bg-black/40 border-blue-500/10 h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-100">Raw Data</CardTitle>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-blue-400" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(selectedAlert).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <p className="text-base font-medium text-blue-300">{key}</p>
                  <p className="text-base text-blue-100 break-all font-mono bg-black/20 p-3 rounded-lg">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnomaliesTable;