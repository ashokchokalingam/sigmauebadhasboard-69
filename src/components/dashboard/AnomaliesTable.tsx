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

const RawDataView = ({ alert }: { alert: Alert }) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  
  return (
    <div className="space-y-6">
      {/* User & System Info Section */}
      <div className="space-y-4 bg-blue-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-300">User & System Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-400">Username</p>
            <p className="text-base text-blue-100 font-mono">{alert.user_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Computer Name</p>
            <p className="text-base text-blue-100 font-mono">{alert.computer_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">IP Address</p>
            <p className="text-base text-blue-100 font-mono">{alert.ip_address || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Time</p>
            <p className="text-base text-blue-100 font-mono">
              {new Date(alert.system_time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Details Section */}
      <div className="space-y-4 bg-purple-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-300">Alert Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-purple-400">Title</p>
            <p className="text-base text-purple-100">{alert.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-purple-400">Rule ID</p>
            <p className="text-base text-purple-100 font-mono">{alert.ruleid}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-purple-400">Task</p>
            <p className="text-base text-purple-100">{alert.task}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-purple-400">Rule Level</p>
            <p className="text-base text-purple-100 capitalize">{alert.rule_level}</p>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK Section */}
      <div className="space-y-4 bg-green-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-300">MITRE ATT&CK</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-400">Tactics</p>
            <p className="text-base text-green-100">{tactics || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">Techniques</p>
            <p className="text-base text-green-100">{techniques || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Raw Data Section */}
      <div className="space-y-4 bg-gray-950/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-300">Raw Data</h3>
        <pre className="text-sm text-gray-100 font-mono bg-black/40 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(JSON.parse(alert.raw), null, 2)}
        </pre>
      </div>
    </div>
  );
};

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

const extractTacticsAndTechniques = (tags: string) => {
  const tagArray = tags.split(',').map(t => t.trim());
  const tactics: string[] = [];
  const techniques: string[] = [];

  tagArray.forEach(tag => {
    if (tag.includes('t1') || tag.includes('T1')) {
      techniques.push(tag.toUpperCase());
    } else if (tag.includes('attack.')) {
      tactics.push(tag.replace('attack.', '').toLowerCase());
    }
  });

  return {
    tactics: tactics.join(', '),
    techniques: techniques.join(', ')
  };
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
                  return (
                    <TableRow 
                      key={alert.id} 
                      className="hover:bg-blue-950/30 cursor-pointer"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <TableCell className="font-mono text-blue-300 text-sm whitespace-nowrap">
                        {new Date(alert.system_time).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-blue-100 whitespace-nowrap">{alert.user_id}</TableCell>
                      <TableCell className="text-blue-100 whitespace-nowrap">{alert.computer_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <span className="text-blue-100">{alert.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                          {tactics || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
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
                        <button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors">
                          <ChevronRight className="h-4 w-4 text-blue-400" />
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

      {/* Side Pane for Raw Data */}
      {selectedAlert && (
        <Card className="w-[800px] bg-black/40 border-blue-500/10 h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-100">Alert Details</CardTitle>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-blue-400" />
            </button>
          </CardHeader>
          <CardContent>
            <RawDataView alert={selectedAlert} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnomaliesTable;
