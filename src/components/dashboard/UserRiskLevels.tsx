import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "./types";

interface UserRiskLevelsProps {
  alerts: Alert[];
}

const UserRiskLevels = ({ alerts }: UserRiskLevelsProps) => {
  const calculateUserRisks = () => {
    const userRisks = new Map<string, { level: string; user: string }>();
    
    alerts.forEach((alert) => {
      if (!alert.user_id) return;
      
      let riskLevel = "Low";
      if (alert.rule_level === "critical" || alert.dbscan_cluster === -1) {
        riskLevel = "Critical";
      } else if (alert.rule_level === "high") {
        riskLevel = "High";
      } else if (alert.rule_level === "medium") {
        riskLevel = "Medium";
      }
      
      userRisks.set(alert.user_id, { level: riskLevel, user: alert.user_id });
    });
    
    return Array.from(userRisks.values()).reduce((acc, { level, user }) => {
      if (!acc[level]) acc[level] = [];
      acc[level].push(user);
      return acc;
    }, {} as Record<string, string[]>);
  };

  const userRisks = calculateUserRisks();
  const riskLevels = ["Critical", "High", "Medium", "Low"];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-blue-500";
      default: return "bg-green-500";
    }
  };

  return (
    <Card className="bg-[#1a1f2c] border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-200">User Risk Levels</CardTitle>
        <p className="text-sm text-gray-400">Users categorized by risk severity</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {riskLevels.map((level) => (
          <div key={level} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-200">{level}</span>
              <span className={`px-2 py-1 rounded text-xs text-white ${getRiskColor(level)}`}>
                {userRisks[level]?.length || 0} users
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userRisks[level]?.map((user) => (
                <span
                  key={user}
                  className="px-3 py-1.5 bg-gray-800/50 rounded-full text-sm text-gray-300"
                >
                  {user}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserRiskLevels;