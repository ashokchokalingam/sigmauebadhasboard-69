import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Monitor, AlertTriangle, Shield } from "lucide-react";
import { Alert } from "./types";
import { getRiskScore } from "./utils";

interface RiskyEntity {
  id: string;
  riskScore: number;
  eventCount: number;
  uniqueTitles: Set<string>;
  lastWeekRiskScore: number;
}

interface RiskyEntitiesProps {
  alerts: Alert[];
}

const RiskyEntities = ({ alerts }: RiskyEntitiesProps) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Calculate risky users with unique titles and 7-day risk score
  const riskyUsers = alerts.reduce((acc: { [key: string]: RiskyEntity }, alert) => {
    if (!alert.user_id || alert.user_id.trim() === '') return acc;
    
    const alertDate = new Date(alert.system_time);
    const isWithinLastWeek = alertDate >= sevenDaysAgo;
    
    if (!acc[alert.user_id]) {
      acc[alert.user_id] = {
        id: alert.user_id,
        riskScore: getRiskScore(alert),
        eventCount: 1,
        uniqueTitles: new Set([alert.title]),
        lastWeekRiskScore: isWithinLastWeek ? getRiskScore(alert) : 0
      };
    } else {
      acc[alert.user_id].riskScore = Math.max(acc[alert.user_id].riskScore, getRiskScore(alert));
      acc[alert.user_id].eventCount++;
      acc[alert.user_id].uniqueTitles.add(alert.title);
      if (isWithinLastWeek) {
        acc[alert.user_id].lastWeekRiskScore += getRiskScore(alert);
      }
    }
    return acc;
  }, {});

  // Calculate risky computers with unique titles and 7-day risk score
  const riskyComputers = alerts.reduce((acc: { [key: string]: RiskyEntity }, alert) => {
    if (!alert.computer_name || alert.computer_name.trim() === '') return acc;
    
    const alertDate = new Date(alert.system_time);
    const isWithinLastWeek = alertDate >= sevenDaysAgo;
    
    if (!acc[alert.computer_name]) {
      acc[alert.computer_name] = {
        id: alert.computer_name,
        riskScore: getRiskScore(alert),
        eventCount: 1,
        uniqueTitles: new Set([alert.title]),
        lastWeekRiskScore: isWithinLastWeek ? getRiskScore(alert) : 0
      };
    } else {
      acc[alert.computer_name].riskScore = Math.max(acc[alert.computer_name].riskScore, getRiskScore(alert));
      acc[alert.computer_name].eventCount++;
      acc[alert.computer_name].uniqueTitles.add(alert.title);
      if (isWithinLastWeek) {
        acc[alert.computer_name].lastWeekRiskScore += getRiskScore(alert);
      }
    }
    return acc;
  }, {});

  const topRiskyUsers = Object.values(riskyUsers)
    .sort((a, b) => b.lastWeekRiskScore - a.lastWeekRiskScore)
    .slice(0, 5);

  const topRiskyComputers = Object.values(riskyComputers)
    .sort((a, b) => b.lastWeekRiskScore - a.lastWeekRiskScore)
    .slice(0, 5);

  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-500";
    if (score >= 6) return "text-orange-500";
    if (score >= 4) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Risky Users Card */}
      <Card className="bg-black/40 border-slate-800 hover:bg-black/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <User className="h-5 w-5 text-red-500" />
            Top Risky Users (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRiskyUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 transition-all"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-slate-200">{user.id}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">
                      {user.uniqueTitles.size} unique alerts
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">
                      {user.eventCount} total events
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-bold text-lg ${getRiskColor(user.lastWeekRiskScore)}`}>
                    {user.lastWeekRiskScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">Risk Score</span>
                </div>
              </div>
            ))}
            {topRiskyUsers.length === 0 && (
              <div className="text-center text-slate-500 py-4">
                No risky users detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risky Computers Card */}
      <Card className="bg-black/40 border-slate-800 hover:bg-black/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Monitor className="h-5 w-5 text-red-500" />
            Top Risky Computers (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRiskyComputers.map((computer) => (
              <div
                key={computer.id}
                className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 transition-all"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-slate-200">{computer.id}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">
                      {computer.uniqueTitles.size} unique alerts
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">
                      {computer.eventCount} total events
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-bold text-lg ${getRiskColor(computer.lastWeekRiskScore)}`}>
                    {computer.lastWeekRiskScore.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">Risk Score</span>
                </div>
              </div>
            ))}
            {topRiskyComputers.length === 0 && (
              <div className="text-center text-slate-500 py-4">
                No risky computers detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskyEntities;