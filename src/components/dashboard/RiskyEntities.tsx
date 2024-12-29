import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Monitor, Activity } from "lucide-react";
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
  type: "users" | "computers";
}

const RiskyEntities = ({ alerts, type }: RiskyEntitiesProps) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const calculateRiskyEntities = () => {
    const entities: { [key: string]: RiskyEntity } = {};

    alerts.forEach((alert) => {
      const entityId = type === "users" ? alert.user_id : alert.computer_name;
      if (!entityId || entityId.trim() === '') return;
      
      const alertDate = new Date(alert.system_time);
      const isWithinLastWeek = alertDate >= sevenDaysAgo;
      
      if (!entities[entityId]) {
        entities[entityId] = {
          id: entityId,
          riskScore: getRiskScore(alert),
          eventCount: 1,
          uniqueTitles: new Set([alert.title]),
          lastWeekRiskScore: isWithinLastWeek ? getRiskScore(alert) : 0
        };
      } else {
        // Only update risk score if this is a unique alert title
        if (!entities[entityId].uniqueTitles.has(alert.title)) {
          entities[entityId].uniqueTitles.add(alert.title);
          if (isWithinLastWeek) {
            entities[entityId].lastWeekRiskScore += getRiskScore(alert);
          }
        }
        entities[entityId].eventCount++;
      }
    });

    return entities;
  };

  const getRiskColor = (score: number) => {
    if (score >= 500) return "text-red-500";
    if (score >= 100) return "text-orange-500";
    if (score >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  const topRiskyEntities = Object.values(calculateRiskyEntities())
    .sort((a, b) => b.lastWeekRiskScore - a.lastWeekRiskScore)
    .slice(0, 5);

  const EntityIcon = type === "users" ? User : Monitor;

  return (
    <div className="space-y-4">
      {topRiskyEntities.map((entity) => (
        <div key={entity.id} 
          className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-blue-500/10 hover:bg-black/50 transition-all duration-300">
          <div className="flex items-center gap-3">
            <EntityIcon className={`h-8 w-8 ${type === "users" ? "text-blue-400" : "text-orange-400"}`} />
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
      ))}
      {topRiskyEntities.length === 0 && (
        <div className="text-center text-blue-400/60 py-4">
          No risky {type} detected
        </div>
      )}
    </div>
  );
};

export default RiskyEntities;