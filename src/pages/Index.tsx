import { Activity, AlertTriangle, Shield, Users, Clock, Download } from "lucide-react";
import { useState } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import AnomaliesTable from "@/components/dashboard/AnomaliesTable";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";

const Index = () => {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex flex-col gap-6 lg:flex-row items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]">
          MITRE Anomaly Detection Dashboard
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
          value="156"
          icon={AlertTriangle}
          subtitle="24 critical alerts"
          subtitleIcon={Activity}
          gradient="from-[#3B82F6] to-[#2563EB]"
        />
        <StatsCard
          title="High-Risk Anomalies"
          value="45"
          icon={Shield}
          subtitle="Immediate attention needed"
          subtitleIcon={AlertTriangle}
          gradient="from-[#2563EB] to-[#1D4ED8]"
        />
        <StatsCard
          title="Affected Users"
          value="23"
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
        <TacticsChart />
        <SeverityChart />
      </div>

      <AnomaliesTable />
    </div>
  );
};

export default Index;