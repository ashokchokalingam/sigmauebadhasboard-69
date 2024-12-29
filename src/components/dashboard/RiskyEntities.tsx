import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, UserX, MonitorX } from "lucide-react";
import { Alert } from "./types";
import { getRiskScore } from "./utils";

interface RiskyEntity {
  id: string;
  riskScore: number;
  eventCount: number;
}

interface RiskyEntitiesProps {
  alerts: Alert[];
}

const RiskyEntities = ({ alerts }: RiskyEntitiesProps) => {
  // Calculate risky users
  const riskyUsers = alerts.reduce((acc: { [key: string]: RiskyEntity }, alert) => {
    if (!alert.user_id || alert.user_id.trim() === '') return acc;
    
    if (!acc[alert.user_id]) {
      acc[alert.user_id] = {
        id: alert.user_id,
        riskScore: getRiskScore(alert),
        eventCount: 1
      };
    } else {
      acc[alert.user_id].riskScore = Math.max(acc[alert.user_id].riskScore, getRiskScore(alert));
      acc[alert.user_id].eventCount++;
    }
    return acc;
  }, {});

  // Calculate risky computers
  const riskyComputers = alerts.reduce((acc: { [key: string]: RiskyEntity }, alert) => {
    if (!alert.computer_name || alert.computer_name.trim() === '') return acc;
    
    if (!acc[alert.computer_name]) {
      acc[alert.computer_name] = {
        id: alert.computer_name,
        riskScore: getRiskScore(alert),
        eventCount: 1
      };
    } else {
      acc[alert.computer_name].riskScore = Math.max(acc[alert.computer_name].riskScore, getRiskScore(alert));
      acc[alert.computer_name].eventCount++;
    }
    return acc;
  }, {});

  const topRiskyUsers = Object.values(riskyUsers)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const topRiskyComputers = Object.values(riskyComputers)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-500";
    if (score >= 6) return "text-orange-500";
    if (score >= 4) return "text-yellow-500";
    return "text-green-500";
  };

  const getRiskBorderColor = (score: number) => {
    if (score >= 8) return "border-red-500/20";
    if (score >= 6) return "border-orange-500/20";
    if (score >= 4) return "border-yellow-500/20";
    return "border-green-500/20";
  };

  const getRiskBackground = (score: number) => {
    if (score >= 8) return "bg-red-950/20";
    if (score >= 6) return "bg-orange-950/20";
    if (score >= 4) return "bg-yellow-950/20";
    return "bg-green-950/20";
  };

  return (
    <Card className="bg-black/40 border-slate-800 hover:bg-black/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          High Risk Entities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Risky Users Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-400" />
              Top Risky Users
            </h3>
            <div className="space-y-2">
              {topRiskyUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:translate-x-1
                    ${getRiskBackground(user.riskScore)} ${getRiskBorderColor(user.riskScore)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-200">{user.id}</span>
                    <span className="text-slate-400 text-sm px-2 py-0.5 bg-slate-900/50 rounded-full">
                      {user.eventCount} events
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${getRiskColor(user.riskScore)}`}>
                    {user.riskScore.toFixed(1)}
                  </span>
                </div>
              ))}
              {topRiskyUsers.length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  No risky users detected
                </div>
              )}
            </div>
          </div>

          {/* Risky Computers Section */}
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <MonitorX className="h-4 w-4 text-red-400" />
              Top Risky Computers
            </h3>
            <div className="space-y-2">
              {topRiskyComputers.map((computer) => (
                <div
                  key={computer.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:translate-x-1
                    ${getRiskBackground(computer.riskScore)} ${getRiskBorderColor(computer.riskScore)}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-200">{computer.id}</span>
                    <span className="text-slate-400 text-sm px-2 py-0.5 bg-slate-900/50 rounded-full">
                      {computer.eventCount} events
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${getRiskColor(computer.riskScore)}`}>
                    {computer.riskScore.toFixed(1)}
                  </span>
                </div>
              ))}
              {topRiskyComputers.length === 0 && (
                <div className="text-center text-slate-500 py-4">
                  No risky computers detected
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskyEntities;