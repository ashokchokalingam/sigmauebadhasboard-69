import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Monitor, User } from "lucide-react";
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

  return (
    <Card className="bg-black/40 border-orange-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-100">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          High Risk Entities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Risky Users Section */}
          <div>
            <h3 className="text-sm font-medium text-orange-200 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Top Risky Users
            </h3>
            <div className="space-y-2">
              {topRiskyUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-orange-950/20 rounded-lg border border-orange-500/20"
                >
                  <span className="font-mono text-orange-100">{user.id}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-200 text-sm">
                      {user.eventCount} events
                    </span>
                    <span className={`font-bold ${getRiskColor(user.riskScore)}`}>
                      {user.riskScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risky Computers Section */}
          <div>
            <h3 className="text-sm font-medium text-orange-200 mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Top Risky Computers
            </h3>
            <div className="space-y-2">
              {topRiskyComputers.map((computer) => (
                <div
                  key={computer.id}
                  className="flex items-center justify-between p-2 bg-orange-950/20 rounded-lg border border-orange-500/20"
                >
                  <span className="font-mono text-orange-100">{computer.id}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-200 text-sm">
                      {computer.eventCount} events
                    </span>
                    <span className={`font-bold ${getRiskColor(computer.riskScore)}`}>
                      {computer.riskScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskyEntities;