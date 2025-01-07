import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import TimelineTooltip from "../TimelineTooltip";

interface SeverityData {
  severity: string;
  count: number;
  title?: string;
  description?: string;
  first_time_seen?: string;
  last_time_seen?: string;
  tags?: string;
}

interface SeverityDistributionChartProps {
  severityData: SeverityData[];
}

const SeverityDistributionChart = ({ severityData }: SeverityDistributionChartProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return '#FF1A1A';
      case 'high': return '#FF6B00';
      case 'medium': return '#FFB020';
      case 'low': return '#10B981';
      case 'informational': return '#3B82F6';
      default: return '#64748B';
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-blue-500/10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-300">Event Severity Distribution</h3>
      </div>
      <div className="h-[300px]"> {/* Increased height for better visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={severityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barSize={40}
          >
            <XAxis 
              dataKey="severity"
              stroke="#94A3B8"
              tick={{ fill: '#E2E8F0', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: '#E2E8F0', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip
              content={<TimelineTooltip />}
            />
            <Bar 
              dataKey="count" 
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                fill: '#E2E8F0',
                fontSize: 12,
                formatter: (value: number) => value.toLocaleString()
              }}
            >
              {severityData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getSeverityColor(entry.severity)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SeverityDistributionChart;