import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Shield, Users, ChartPie, Star, SignalHigh } from "lucide-react";
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
  { name: "Initial Access", alerts: 24, color: "#8B5CF6" },
  { name: "Execution", alerts: 13, color: "#D946EF" },
  { name: "Persistence", alerts: 18, color: "#F97316" },
  { name: "Privilege Escalation", alerts: 8, color: "#0EA5E9" },
  { name: "Defense Evasion", alerts: 15, color: "#6366F1" },
];

const severityData = [
  { name: "Critical", value: 15, color: "#EF4444" },
  { name: "High", value: 25, color: "#F97316" },
  { name: "Medium", value: 35, color: "#FBBF24" },
  { name: "Low", value: 25, color: "#34D399" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar-background to-background p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          UEBA Security Dashboard
        </h1>
        <div className="flex items-center gap-2 bg-sidebar-accent rounded-lg px-4 py-2">
          <SignalHigh className="h-5 w-5 text-green-500 animate-pulse" />
          <span className="font-medium">Live Monitoring</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">15</div>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-amber-500 mr-1" />
              <p className="text-xs text-muted-foreground">Immediate attention required</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">245</div>
            <div className="flex items-center mt-1">
              <Activity className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-muted-foreground">Active in last 24h</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Score</CardTitle>
            <ChartPie className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">67%</div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
              <p className="text-xs text-muted-foreground">Risk level: Medium</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Controls</CardTitle>
            <Shield className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">12/15</div>
            <div className="flex items-center mt-1">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <p className="text-xs text-muted-foreground">Controls active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              MITRE ATT&CK Tactics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie className="h-5 w-5 text-blue-500" />
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
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {severityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;