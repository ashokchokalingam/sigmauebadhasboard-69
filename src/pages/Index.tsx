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
import { getFilteredAlerts, calculateStats } from "@/components/dashboard/alertUtils";
import { Alert } from "@/components/dashboard/types";

// Get API URL from window object, which will be set by the deployment platform
const API_URL = (window as any).__API_URL__ || 'http://localhost:8000';

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

  const stats = calculateStats(alerts);
  const filteredAlerts = getFilteredAlerts(alerts, selectedSeverity, selectedTactic);

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
          title="Risky Users"
          value={stats.uniqueUsers.current.toString()}
          icon={Users}
          subtitle={`${stats.uniqueUsers.change >= 0 ? '+' : ''}${stats.uniqueUsers.change}% from last period`}
          subtitleIcon={stats.uniqueUsers.change >= 0 ? TrendingUp : TrendingDown}
        />
        <StatsCard
          title="Average Risk Score"
          value={stats.riskScore.current.toString()}
          icon={Shield}
          subtitle={`${stats.riskScore.change >= 0 ? '+' : ''}${stats.riskScore.change}% from last period`}
          subtitleIcon={stats.riskScore.change >= 0 ? TrendingUp : TrendingDown}
        />
        <StatsCard
          title="Anomalies Detected"
          value={stats.anomalies.current.toString()}
          icon={AlertTriangle}
          subtitle={`${stats.anomalies.change >= 0 ? '+' : ''}${stats.anomalies.change}% from last period`}
          subtitleIcon={stats.anomalies.change >= 0 ? TrendingUp : TrendingDown}
        />
      </div>

      {/* Top Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 border border-blue-500/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Risky Users ({stats.uniqueUsers.users.length})
          </h2>
          <div className="space-y-2">
            {stats.uniqueUsers.users.map((userId) => (
              <div 
                key={userId}
                onClick={() => setSelectedEntity({ type: "user", id: userId })}
                className="p-4 bg-blue-950/30 rounded-lg cursor-pointer hover:bg-blue-900/30 transition-colors flex items-center gap-3"
              >
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-blue-100">{userId}</span>
              </div>
            ))}
          </div>
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