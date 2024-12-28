import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Shield, Users, ChartPie, Skull, SignalHigh, Siren } from "lucide-react";
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

const alertData = [
  { name: "Initial Access", alerts: 24, color: "#FF4D4D" },
  { name: "Execution", alerts: 13, color: "#FF1A1A" },
  { name: "Persistence", alerts: 18, color: "#FF8533" },
  { name: "Privilege Escalation", alerts: 28, color: "#FF3333" },
  { name: "Defense Evasion", alerts: 35, color: "#FF0000" },
  { name: "Credential Access", alerts: 22, color: "#CC0000" },
  { name: "Discovery", alerts: 19, color: "#FF6666" },
  { name: "Lateral Movement", alerts: 31, color: "#B30000" },
];

const severityData = [
  { name: "Critical", value: 45, color: "#FF0000" },
  { name: "High", value: 35, color: "#FF4D4D" },
  { name: "Medium", value: 15, color: "#FF8533" },
  { name: "Low", value: 5, color: "#FFB366" },
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
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 animate-pulse">
          Critical Security Alerts
        </h1>
        <div className="flex items-center gap-2 bg-red-950/30 rounded-lg px-4 py-2 border border-red-900/50">
          <Siren className="h-5 w-5 text-red-500 animate-pulse" />
          <span className="font-medium text-red-100">LIVE THREAT MONITORING</span>
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
        <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-100">
              <Activity className="h-5 w-5 text-red-500" />
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
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      color: '#fff'
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

      <Card className="bg-black/40 border-red-900/20 hover:bg-black/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-100">
            <Skull className="h-5 w-5 text-red-500" />
            Critical Users Under Attack
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {criticalUsers.map((user, index) => (
              <div 
                key={index}
                className="p-4 bg-red-950/20 rounded-lg border border-red-900/30 hover:bg-red-950/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-red-100">{user.user}</span>
                  <span className="text-red-500 font-bold">{user.risk}% Risk</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.tactics.map((tactic, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-200 border border-red-500/30"
                    >
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;