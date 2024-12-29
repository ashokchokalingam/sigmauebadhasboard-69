import { Activity, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import AttackChainCard from "@/components/dashboard/AttackChainCard";
import SystemHealthCard from "@/components/dashboard/SystemHealthCard";
import { useToast } from "@/components/ui/use-toast";
import UserTimeline from "@/components/UserTimeline";

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
  const { toast } = useToast();
  
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch alerts. Please check your API connection.",
          variant: "destructive",
        });
      }
    }
  });

  const filteredAlerts = alerts.filter(alert => {
    // First apply severity filter
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

    // Then apply tactic filter if one is selected
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

  const timelineEvents = [
    {
      time: "6:15:06 AM",
      event: "WMI Event Subscription Created",
      severity: "critical",
      tactic: "Persistence"
    },
    {
      time: "6:13:50 AM",
      event: "Important Windows Eventlog Cleared",
      severity: "high",
      tactic: "Defense Evasion"
    },
    {
      time: "6:13:46 AM",
      event: "Security Eventlog Cleared",
      severity: "high",
      tactic: "Defense Evasion"
    }
  ] as const;

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Anomalies"
          value={alerts.length}
          icon={AlertTriangle}
          subtitle={`${alerts.filter(a => a.rule_level === 'critical').length} critical alerts`}
          subtitleIcon={Activity}
          gradient="from-[#3B82F6] to-[#2563EB]"
        />
        <StatsCard
          title="Outliers Detected"
          value={alerts.filter(a => a.dbscan_cluster === -1).length}
          icon={Shield}
          subtitle="DBSCAN cluster -1"
          subtitleIcon={AlertTriangle}
          gradient="from-[#2563EB] to-[#1D4ED8]"
        />
        <StatsCard
          title="Affected Users"
          value={new Set(alerts.map(a => a.user_id)).size}
          icon={Users}
          subtitle="Under investigation"
          subtitleIcon={Activity}
          gradient="from-[#1D4ED8] to-[#1E40AF]"
        />
        <StatsCard
          title="Detection Time"
          value="5.2s"
          icon={Clock}
          subtitle="Average response time"
          subtitleIcon={Activity}
          gradient="from-[#1E40AF] to-[#0EA5E9]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <TacticsChart 
          alerts={alerts} 
          onTacticSelect={setSelectedTactic}
        />
        <SeverityChart 
          alerts={alerts} 
          onSeveritySelect={setSelectedSeverity} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <AttackChainCard />
        <SystemHealthCard />
      </div>

      <div className="grid gap-6 mb-8">
        <UserTimeline username="Administrator" events={timelineEvents} />
      </div>

      <div className="w-full">
        <AnomaliesTable alerts={filteredAlerts} />
      </div>
    </div>
  );
};

export default Index;
