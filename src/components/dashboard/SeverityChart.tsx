import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Alert {
  rule_level: string;
  dbscan_cluster: number;
}

interface SeverityChartProps {
  alerts: Alert[];
  onSeveritySelect: (severity: string | null) => void;
}

const SeverityChart = ({ alerts, onSeveritySelect }: SeverityChartProps) => {
  const calculateSeverityData = () => {
    const severityCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    alerts.forEach(alert => {
      if (alert.rule_level === 'critical' || alert.dbscan_cluster === -1) {
        severityCounts.Critical++;
      } else if (alert.rule_level === 'high') {
        severityCounts.High++;
      } else if (alert.rule_level === 'medium') {
        severityCounts.Medium++;
      } else {
        severityCounts.Low++;
      }
    });

    return [
      { name: "Critical", value: severityCounts.Critical, color: "#EF4444" },
      { name: "High", value: severityCounts.High, color: "#F97316" },
      { name: "Medium", value: severityCounts.Medium, color: "#FBBF24" },
      { name: "Low", value: severityCounts.Low, color: "#34D399" },
    ];
  };

  const severityData = calculateSeverityData();

  return (
    <Card className="bg-black/40 border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-100">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
          Risk Distribution
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
                onDoubleClick={(data) => {
                  if (data && data.name) {
                    onSeveritySelect(data.name);
                  }
                }}
                onClick={(data) => {
                  if (data && data.name) {
                    onSeveritySelect(null);
                  }
                }}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #3B82F6',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                itemStyle={{
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '4px 8px'
                }}
                labelStyle={{
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {severityData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-xs text-blue-200">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeverityChart;