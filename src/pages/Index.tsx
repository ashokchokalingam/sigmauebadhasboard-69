import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Shield, Users, ChartPie, Skull, Siren } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CriticalUsers from "@/components/CriticalUsers";

const alertData = [
  { name: "Initial Access", alerts: 24, color: "#9b87f5" },
  { name: "Execution", alerts: 13, color: "#7E69AB" },
  { name: "Persistence", alerts: 18, color: "#6E59A5" },
  { name: "Privilege Escalation", alerts: 28, color: "#8B5CF6" },
  { name: "Defense Evasion", alerts: 35, color: "#E5DEFF" },
  { name: "Credential Access", alerts: 22, color: "#0EA5E9" },
  { name: "Discovery", alerts: 19, color: "#1EAEDB" },
  { name: "Lateral Movement", alerts: 31, color: "#33C3F0" },
];

const severityData = [
  { name: "Critical", value: 45, color: "#8B5CF6" },
  { name: "High", value: 35, color: "#7E69AB" },
  { name: "Medium", value: 15, color: "#6E59A5" },
  { name: "Low", value: 5, color: "#E5DEFF" },
];

const criticalUsers = [
  { user: "admin.system", tactics: ["Privilege Escalation", "Defense Evasion"], risk: 98 },
  { user: "service.account", tactics: ["Lateral Movement", "Discovery"], risk: 95 },
  { user: "db.admin", tactics: ["Credential Access", "Initial Access"], risk: 92 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#121212] p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] animate-pulse">
          Critical Security Alerts
        </h1>
        <div className="flex items-center gap-2 bg-[#1A1F2C]/30 rounded-lg px-4 py-2 border border-[#9b87f5]/50">
          <Siren className="h-5 w-5 text-[#9b87f5] animate-pulse" />
          <span className="font-medium text-[#E5DEFF]">LIVE THREAT MONITORING</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Critical Threats</CardTitle>
            <Skull className="h-5 w-5 text-red-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">45</div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
              <p className="text-xs text-red-200/70">Immediate response required</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Compromised Users</CardTitle>
            <Users className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">23</div>
            <div className="flex items-center mt-1">
              <Activity className="h-4 w-4 text-red-500 mr-1" />
              <p className="text-xs text-red-200/70">Active malicious behavior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Risk Score</CardTitle>
            <ChartPie className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">89%</div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
              <p className="text-xs text-red-200/70">Critical risk level</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Failed Controls</CardTitle>
            <Shield className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">7/15</div>
            <div className="flex items-center mt-1">
              <Activity className="h-4 w-4 text-red-500 mr-1" />
              <p className="text-xs text-red-200/70">Security controls breached</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-black/40 border-[#9b87f5]/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E5DEFF]">
              <Activity className="h-5 w-5 text-[#9b87f5]" />
              MITRE ATT&CK Tactics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26, 31, 44, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #9b87f5',
                      color: '#E5DEFF'
                    }}
                  />
                  <Bar dataKey="alerts">
                    {alertData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alert Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {severityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-red-200/70">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CriticalUsers users={criticalUsers} />
    </div>
  );
};

export default Index;
