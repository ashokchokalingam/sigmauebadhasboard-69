import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Alert } from "./types";

interface AlertDistributionProps {
  alerts: Alert[];
}

const AlertDistribution = ({ alerts }: AlertDistributionProps) => {
  const calculateSeverityData = () => {
    const severityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    alerts.forEach((alert) => {
      if (alert.rule_level === "critical" || (typeof alert.dbscan_cluster === 'number' && alert.dbscan_cluster === -1)) {
        severityCounts.Critical++;
      } else if (alert.rule_level === "high") {
        severityCounts.High++;
      } else if (alert.rule_level === "medium") {
        severityCounts.Medium++;
      } else {
        severityCounts.Low++;
      }
    });

    return Object.entries(severityCounts).map(([name, value]) => ({
      name,
      value,
      color: name === "Critical" ? "#ef4444" : 
             name === "High" ? "#f97316" : 
             name === "Medium" ? "#3b82f6" : 
             "#22c55e"
    }));
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1f2c] border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#1a1f2c]/80 border-gray-800/50">
      <CardHeader>
        <CardTitle className="text-gray-200">Alert Distribution</CardTitle>
        <p className="text-sm text-gray-400">Alert severity breakdown</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calculateSeverityData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#4b5563" }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af" }}
                axisLine={{ stroke: "#4b5563" }}
                domain={[0, 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {calculateSeverityData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDistribution;