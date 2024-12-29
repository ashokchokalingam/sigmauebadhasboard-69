import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Monitor, AlertTriangle, Shield, Activity } from "lucide-react";
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

  // Calculate risky users
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

  // Calculate risky computers
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
    if (score >= 500) return "text-red-500";
    if (score >= 100) return "text-orange-500";
    if (score >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const RiskEntity = ({ entity, type }: { entity: RiskyEntity, type: 'user' | 'computer' }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <div className="flex items-center gap-3">
        {type === 'user' ? (
          <User className="h-8 w-8 text-blue-400" />
        ) : (
          <Monitor className="h-8 w-8 text-blue-400" />
        )}
        <div className="flex flex-col">
          <span className="font-mono text-sm text-blue-100">{entity.id}</span>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="h-3 w-3 text-blue-400" />
            <span className="text-xs text-blue-300">{entity.uniqueTitles.size} unique alerts</span>
            <span className="text-xs text-blue-300">•</span>
            <span className="text-xs text-blue-300">{entity.eventCount} events</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className={`text-2xl font-bold ${getRiskColor(entity.lastWeekRiskScore)}`}>
          {entity.lastWeekRiskScore.toFixed(1)}
        </div>
        <span className="text-xs text-blue-300">Risk Score</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Top Risky Users (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRiskyUsers.map((user) => (
              <RiskEntity key={user.id} entity={user} type="user" />
            ))}
            {topRiskyUsers.length === 0 && (
              <div className="text-center text-blue-400/60 py-4">
                No risky users detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-100">
            <Shield className="h-5 w-5 text-red-500" />
            Top Risky Computers (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topRiskyComputers.map((computer) => (
              <RiskEntity key={computer.id} entity={computer} type="computer" />
            ))}
            {topRiskyComputers.length === 0 && (
              <div className="text-center text-blue-400/60 py-4">
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