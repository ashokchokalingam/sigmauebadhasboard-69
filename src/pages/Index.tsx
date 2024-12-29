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

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity
      ? (() => {
          if (selectedSeverity === 'Critical') {
            return alert.rule_level === 'critical' || alert.dbscan_cluster === -1;
          } else if (selectedSeverity === 'High') {
            return alert.rule_level === 'high';
          } else if (selectedSeverity === 'Medium') {
            return alert.rule_level === 'medium';
          } else {
            return alert.rule_level === 'low';
          }
        })()
      : true;

    const tacticMatch = selectedTactic
      ? alert.tags.includes(`attack.${selectedTactic}`)
      : true;

    return severityMatch && tacticMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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

      {!selectedEntity ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Active Users"
              value="156"
              icon={Users}
              subtitle="+8% from last period"
              subtitleIcon={TrendingUp}
              gradient="from-emerald-500 to-emerald-700"
            />
            <StatsCard
              title="Average Risk Score"
              value="65"
              icon={Shield}
              subtitle="-5% from last period"
              subtitleIcon={TrendingDown}
              gradient="from-amber-500 to-amber-700"
            />
            <StatsCard
              title="Anomalies Detected"
              value="7"
              icon={AlertTriangle}
              subtitle="-2% from last period"
              subtitleIcon={TrendingDown}
              gradient="from-red-500 to-red-700"
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
        </>
      ) : (
        <div className="flex justify-end">
          <TimelineView
            alerts={alerts}
            entityType={selectedEntity.type}
            entityId={selectedEntity.id}
            onClose={() => setSelectedEntity(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;