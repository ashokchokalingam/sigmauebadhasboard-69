import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
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

  // Transform data to include time information
  const transformedData = severityData.map(data => ({
    ...data,
    formattedFirstSeen: data.first_time_seen ? format(new Date(data.first_time_seen), 'MMM dd, HH:mm') : '',
    formattedLastSeen: data.last_time_seen ? format(new Date(data.last_time_seen), 'MMM dd, HH:mm') : '',
    displayName: `${data.severity} - ${data.title || ''}`
  }));

  return (
    <Card className="p-6 bg-black/40 border-blue-500/10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-300">Event Severity Distribution</h3>
      </div>
      <div className="h-[400px]"> {/* Increased height for better visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={transformedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis 
              type="number"
              stroke="#94A3B8"
              tick={{ fill: '#E2E8F0', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={200}
              stroke="#94A3B8"
              tick={{ fill: '#E2E8F0', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip
              content={<TimelineTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Bar 
              dataKey="count" 
              radius={[0, 4, 4, 0]}
              barSize={30}
              label={{
                position: 'right',
                fill: '#E2E8F0',
                fontSize: 12,
                formatter: (value: number) => value.toLocaleString()
              }}
            >
              {transformedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getSeverityColor(entry.severity)}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#FF6B00]" />
          <span className="text-sm text-blue-300/70">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#FFB020]" />
          <span className="text-sm text-blue-300/70">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#3B82F6]" />
          <span className="text-sm text-blue-300/70">Informational</span>
        </div>
      </div>
    </Card>
  );
};

export default SeverityDistributionChart;