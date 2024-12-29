import { Activity, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import CriticalUsers from "@/components/CriticalUsers";
import { useToast } from "@/components/ui/use-toast";

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

// Use an environment variable or configure this based on your deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchAlerts = async (): Promise<Alert[]> => {
  const response = await fetch(`${API_URL}/api/alerts`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const { toast } = useToast();
  
  const { data: alerts = [], isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch alerts. Please check your API connection.",
        variant: "destructive",
      });
      console.error('Error fetching alerts:', error);
    },
  });

  // Calculate statistics
  const criticalAlerts = alerts.filter(alert => alert.rule_level === 'critical').length;
  const outliers = alerts.filter(alert => alert.dbscan_cluster === -1).length;
  const uniqueUsers = new Set(alerts.map(alert => alert.user_id)).size;
  
  // Get users under attack (users with critical alerts and outlier behavior)
  const criticalUsers = alerts
    .filter(alert => alert.rule_level === 'critical' || alert.dbscan_cluster === -1)
    .reduce((acc: { [key: string]: any }, alert) => {
      if (!acc[alert.user_id]) {
        acc[alert.user_id] = {
          user: alert.user_id,
          tactics: new Set(),
          risk: 0
        };
      }
      if (alert.tags) {
        alert.tags.split(',').forEach(tag => acc[alert.user_id].tactics.add(tag.trim()));
      }
      acc[alert.user_id].risk += alert.dbscan_cluster === -1 ? 20 : 10;
      return acc;
    }, {});

  const topCriticalUsers = Object.values(criticalUsers)
    .map((user: any) => ({
      ...user,
      tactics: Array.from(user.tactics),
      risk: Math.min(100, user.risk)
    }))
    .sort((a: any, b: any) => b.risk - a.risk)
    .slice(0, 3);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>;
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Anomalies"
          value={alerts.length}
          icon={AlertTriangle}
          subtitle={`${criticalAlerts} critical alerts`}
          subtitleIcon={Activity}
          gradient="from-[#3B82F6] to-[#2563EB]"
        />
        <StatsCard
          title="Outliers Detected"
          value={outliers}
          icon={Shield}
          subtitle="DBSCAN cluster -1"
          subtitleIcon={AlertTriangle}
          gradient="from-[#2563EB] to-[#1D4ED8]"
        />
        <StatsCard
          title="Affected Users"
          value={uniqueUsers}
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
        <TacticsChart alerts={alerts} />
        <SeverityChart alerts={alerts} />
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <AnomaliesTable alerts={alerts} />
        </div>
        <div>
          <CriticalUsers users={topCriticalUsers} />
        </div>
      </div>
    </div>
  );
};

export default Index;