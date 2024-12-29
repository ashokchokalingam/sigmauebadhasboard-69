import { Activity, AlertTriangle, Shield, Users, Clock, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import RiskyEntities from "@/components/dashboard/RiskyEntities";
import TimelineView from "@/components/dashboard/TimelineView";

const API_URL = 'http://192.168.1.129:5000';

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

const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await fetch(`${API_URL}/api/alerts`);
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
};

const Index = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<{ type: "user" | "computer"; id: string } | null>(null);
  
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    meta: {
      onError: () => {
        console.error("Failed to fetch alerts");
      }
    }
  });

  // Calculate stats for current and previous periods
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

  const currentPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= twentyFourHoursAgo
  );

  const previousPeriodAlerts = alerts.filter(alert => 
    new Date(alert.system_time) >= fortyEightHoursAgo &&
    new Date(alert.system_time) < twentyFourHoursAgo
  );

  // Calculate current period stats
  const currentUniqueUsers = new Set(currentPeriodAlerts.map(alert => alert.user_id)).size;
  const previousUniqueUsers = new Set(previousPeriodAlerts.map(alert => alert.user_id)).size;
  const userChangePercent = previousUniqueUsers ? 
    Math.round(((currentUniqueUsers - previousUniqueUsers) / previousUniqueUsers) * 100) : 0;

  // Calculate risk scores
  const calculateAvgRiskScore = (alertsList: typeof alerts) => {
    if (alertsList.length === 0) return 0;
    const totalRiskScore = alertsList.reduce((acc, alert) => 
      acc + (alert.rule_level === 'critical' ? 100 : 
        alert.rule_level === 'high' ? 75 : 
        alert.rule_level === 'medium' ? 50 : 25), 0
    );
    return Math.round(totalRiskScore / alertsList.length);
  };

  const currentAvgRiskScore = calculateAvgRiskScore(currentPeriodAlerts);
  const previousAvgRiskScore = calculateAvgRiskScore(previousPeriodAlerts);
  const riskScoreChangePercent = previousAvgRiskScore ? 
    Math.round(((currentAvgRiskScore - previousAvgRiskScore) / previousAvgRiskScore) * 100) : 0;

  // Calculate anomalies
  const currentAnomalies = currentPeriodAlerts.filter(alert => 
    alert.rule_level === 'critical' || alert.dbscan_cluster === -1
  ).length;
  const previousAnomalies = previousPeriodAlerts.filter(alert => 
    alert.rule_level === 'critical' || alert.dbscan_cluster === -1
  ).length;
  const anomaliesChangePercent = previousAnomalies ? 
    Math.round(((currentAnomalies - previousAnomalies) / previousAnomalies) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedEntity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212]">
        <TimelineView
          alerts={alerts}
          entityType={selectedEntity.type}
          entityId={selectedEntity.id}
          onClose={() => setSelectedEntity(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex flex-col gap-6 lg:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
          Exabeam Anomaly Hunter Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <button className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all duration-300 rounded-lg px-4 py-2 border border-blue-500/10">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active Users"
          value={currentUniqueUsers.toString()}
          icon={Users}
          subtitle={`${userChangePercent >= 0 ? '+' : ''}${userChangePercent}% from last period`}
          subtitleIcon={userChangePercent >= 0 ? TrendingUp : TrendingDown}
        />
        <StatsCard
          title="Average Risk Score"
          value={currentAvgRiskScore.toString()}
          icon={Shield}
          subtitle={`${riskScoreChangePercent >= 0 ? '+' : ''}${riskScoreChangePercent}% from last period`}
          subtitleIcon={riskScoreChangePercent >= 0 ? TrendingUp : TrendingDown}
        />
        <StatsCard
          title="Anomalies Detected"
          value={currentAnomalies.toString()}
          icon={AlertTriangle}
          subtitle={`${anomaliesChangePercent >= 0 ? '+' : ''}${anomaliesChangePercent}% from last period`}
          subtitleIcon={anomaliesChangePercent >= 0 ? TrendingUp : TrendingDown}
        />
      </div>

      {/* Top Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Top Risky Users
          </h2>
          <RiskyEntities 
            alerts={alerts} 
            type="users" 
            onEntitySelect={(id) => setSelectedEntity({ type: "user", id })}
          />
        </div>
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            Top Risky Computers
          </h2>
          <RiskyEntities 
            alerts={alerts} 
            type="computers"
            onEntitySelect={(id) => setSelectedEntity({ type: "computer", id })}
          />
        </div>
      </div>

      {/* MITRE and Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TacticsChart 
          alerts={alerts} 
          onTacticSelect={setSelectedTactic}
        />
        <SeverityChart 
          alerts={alerts} 
          onSeveritySelect={setSelectedSeverity} 
        />
      </div>

      {/* Latest Anomalies */}
      <div className="w-full">
        <AnomaliesTable alerts={filteredAlerts} />
      </div>
    </div>
  );
};

export default Index;
