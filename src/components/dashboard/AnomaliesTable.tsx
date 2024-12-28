import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ChevronRight } from "lucide-react";

const mockData = [
  {
    id: 1,
    riskScore: 9.8,
    tactics: ["Privilege Escalation", "Defense Evasion"],
    username: "admin.system",
    computerName: "DC-PROD-01",
    isOutlier: true,
    timestamp: "2024-04-10T15:23:45",
  },
  {
    id: 2,
    riskScore: 8.5,
    tactics: ["Lateral Movement", "Discovery"],
    username: "service.account",
    computerName: "APP-PROD-03",
    isOutlier: true,
    timestamp: "2024-04-10T15:20:12",
  },
  {
    id: 3,
    riskScore: 7.2,
    tactics: ["Initial Access", "Execution"],
    username: "db.admin",
    computerName: "DB-PROD-02",
    isOutlier: false,
    timestamp: "2024-04-10T15:18:30",
  },
];

const getRiskColor = (score: number) => {
  if (score >= 7) return "text-red-500";
  if (score >= 4) return "text-yellow-500";
  return "text-green-500";
};

const AnomaliesTable = () => {
  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          Detected Anomalies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-blue-500/10">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-blue-950/30">
                <TableHead className="text-blue-300">Risk Score</TableHead>
                <TableHead className="text-blue-300">MITRE Tactics</TableHead>
                <TableHead className="text-blue-300">Username</TableHead>
                <TableHead className="text-blue-300">Computer Name</TableHead>
                <TableHead className="text-blue-300">Outlier</TableHead>
                <TableHead className="text-blue-300">Timestamp</TableHead>
                <TableHead className="text-blue-300 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row) => (
                <TableRow key={row.id} className="hover:bg-blue-950/30">
                  <TableCell className={`font-mono font-bold ${getRiskColor(row.riskScore)}`}>
                    {row.riskScore}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.tactics.map((tactic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                        >
                          {tactic}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-100">{row.username}</TableCell>
                  <TableCell className="text-blue-100">{row.computerName}</TableCell>
                  <TableCell>
                    {row.isOutlier && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                        DBSCAN -1
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-blue-300 text-sm">
                    {new Date(row.timestamp).toLocaleTimeString()}
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
  );
};

export default AnomaliesTable;