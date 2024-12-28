import { Activity, AlertTriangle, Shield, Users, Skull, Siren } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import TacticsChart from "@/components/dashboard/TacticsChart";
import SeverityChart from "@/components/dashboard/SeverityChart";
import CriticalUsers from "@/components/CriticalUsers";

const criticalUsers = [
  { user: "admin.system", tactics: ["Privilege Escalation", "Defense Evasion"], risk: 98 },
  { user: "service.account", tactics: ["Lateral Movement", "Discovery"], risk: 95 },
  { user: "db.admin", tactics: ["Credential Access", "Initial Access"], risk: 92 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
          Security Dashboard
        </h1>
        <div className="flex items-center gap-2 bg-[#1A1F2C]/30 rounded-lg px-4 py-2 border border-[#9b87f5]/10 backdrop-blur-sm">
          <Siren className="h-5 w-5 text-[#9b87f5]" />
          <span className="font-medium text-[#E5DEFF]/90">LIVE MONITORING</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Critical Threats"
          value="45"
          icon={Skull}
          subtitle="Immediate response required"
          subtitleIcon={AlertTriangle}
          gradient="from-[#8B5CF6] to-[#7E69AB]"
        />
        <StatsCard
          title="Compromised Users"
          value="23"
          icon={Users}
          subtitle="Active malicious behavior"
          subtitleIcon={Activity}
          gradient="from-[#6E59A5] to-[#9b87f5]"
        />
        <StatsCard
          title="Risk Score"
          value="89%"
          icon={AlertTriangle}
          subtitle="Critical risk level"
          subtitleIcon={Activity}
          gradient="from-[#9b87f5] to-[#7E69AB]"
        />
        <StatsCard
          title="Failed Controls"
          value="7/15"
          icon={Shield}
          subtitle="Security controls breached"
          subtitleIcon={AlertTriangle}
          gradient="from-[#7E69AB] to-[#6E59A5]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <TacticsChart />
        <SeverityChart />
      </div>

      <CriticalUsers users={criticalUsers} />
    </div>
  );
};

export default Index;