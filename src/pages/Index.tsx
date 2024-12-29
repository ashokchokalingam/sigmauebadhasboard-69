import { Activity, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import { useToast } from "@/components/ui/use-toast";
import CriticalUsers from "@/components/CriticalUsers";

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

  const criticalUsers = [
    {
      user: "john.doe",
      tactics: ["privilege_escalation", "defense_evasion"],
      risk: 89
    },
    {
      user: "admin.system",
      tactics: ["lateral_movement", "credential_access"],
      risk: 76
    },
    {
      user: "sarah.smith",
      tactics: ["execution", "persistence"],
      risk: 72
    }
  ];

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <TacticsChart 
            alerts={alerts} 
            onTacticSelect={setSelectedTactic}
          />
        </div>
        <div className="space-y-6">
          <SeverityChart 
            alerts={alerts} 
            onSeveritySelect={setSelectedSeverity} 
          />
          <CriticalUsers users={criticalUsers} />
        </div>
      </div>

      <div className="w-full">
        <AnomaliesTable alerts={filteredAlerts} />
      </div>
    </div>
  );
};

export default Index;
