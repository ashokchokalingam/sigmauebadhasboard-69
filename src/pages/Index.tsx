import { Activity, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  // Extract unique users and their risk scores from alerts
  const getRiskyUsers = () => {
    const userRiskMap = new Map();
    
    alerts.forEach(alert => {
      if (!userRiskMap.has(alert.user_id)) {
        // Get tactics from alert tags
        const tactics = alert.tags
          .split(',')
          .filter(tag => tag.startsWith('attack.') && !tag.toLowerCase().includes('t1'))
          .map(tag => tag.replace('attack.', ''));
        
        // Calculate risk based on rule_level and outlier status
        let risk = alert.rule_level === 'critical' ? 90 :
                  alert.rule_level === 'high' ? 75 :
                  alert.rule_level === 'medium' ? 50 : 25;
        
        if (alert.dbscan_cluster === -1) risk += 10;
        
        userRiskMap.set(alert.user_id, {
          user: alert.user_id,
          tactics: tactics,
          risk: Math.min(risk, 100)
        });
      }
    });

    return Array.from(userRiskMap.values())
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 3);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const criticalUsers = getRiskyUsers();

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
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
        <TacticsChart 
          alerts={alerts} 
          onTacticSelect={setSelectedTactic}
        />
        <div className="space-y-6">
          <SeverityChart 
            alerts={alerts} 
            onSeveritySelect={setSelectedSeverity} 
          />
          <CriticalUsers users={criticalUsers} />
        </div>
      </div>

      <div className="w-full">
        <AnomaliesTable alerts={alerts} />
      </div>
    </div>
  );
};

export default Index;
