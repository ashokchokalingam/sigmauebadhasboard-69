
import React from "react";
import { Shield, AlertTriangle, Activity, Brain, Hash, FileText } from "lucide-react";
import { Alert } from "./types";
import { cn } from "@/lib/utils";

interface AlertOverviewProps {
  alert: Alert;
}

const AlertOverview = ({ alert }: AlertOverviewProps) => {
  const getRiskScoreColor = (score: number) => {
    if (score <= 25) return "text-green-500";
    if (score <= 50) return "text-yellow-500";
    if (score <= 75) return "text-orange-500";
    return "text-red-500";
  };

  const getRiskScoreBackground = (score: number) => {
    if (score <= 25) return "bg-green-500/10";
    if (score <= 50) return "bg-yellow-500/10";
    if (score <= 75) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="space-y-6 p-6 bg-[#1E1E2F] rounded-lg border border-[#5856D6]/20">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white/90">Alert Overview</h2>
            <p className="text-sm text-white/60">Detailed information about the alert</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getRiskScoreBackground(alert.risk || 0),
            getRiskScoreColor(alert.risk || 0)
          )}>
            Risk Score: {alert.risk || 0}%
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#9b87f5] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/60">Title</p>
                  <h3 className="text-base font-medium text-white">{alert.title}</h3>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#9b87f5] mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/60">Description</p>
                  <p className="text-sm text-white/80 leading-relaxed">{alert.description}</p>
                </div>
              </div>
            </div>

            {/* Rule ID */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-[#9b87f5]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/60">Rule ID</p>
                  <p className="text-sm font-mono text-white">{alert.ruleid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* ML Analysis */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-[#9b87f5] mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white/60">ML Analysis</p>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                      Cluster {alert.ml_cluster || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{alert.ml_description || 'Normal Behavior'}</p>
                </div>
              </div>
            </div>

            {/* Severity */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#9b87f5]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/60">Severity</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      alert.rule_level?.toLowerCase() === 'high' 
                        ? "bg-red-500/20 text-red-400"
                        : alert.rule_level?.toLowerCase() === 'medium'
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    )}>
                      {alert.rule_level}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task */}
            <div className="bg-[#262837] rounded-lg p-4 border border-[#5856D6]/20">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-[#9b87f5]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/60">Task</p>
                  <p className="text-sm text-white">{alert.task || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertOverview;
