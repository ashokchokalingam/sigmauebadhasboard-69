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

interface SeverityData {
  title: string;
  description: string;
  first_time_seen: string;
  last_time_seen: string;
  rule_level: string;
  tags: string;
  total_events: number;
  user_impacted: string;
}

interface SeverityDistributionChartProps {
  severityData: SeverityData[];
}

const SeverityDistributionChart = ({ severityData }: SeverityDistributionChartProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return '#F97316';
      case 'medium': return '#FFB020';
      case 'low': return '#10B981';
      case 'informational': return '#3B82F6';
      default: return '#64748B';
    }
  };

  // Transform data to include formatted display information
  const transformedData = severityData.map(data => ({
    ...data,
    displayName: `${data.title || 'Unknown Event'} (${data.rule_level})`,
    formattedFirstSeen: format(new Date(data.first_time_seen), 'MMM dd, yyyy HH:mm'),
    formattedLastSeen: format(new Date(data.last_time_seen), 'MMM dd, yyyy HH:mm'),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-black/95 border border-blue-500/20 rounded-lg p-4 shadow-xl min-w-[320px]">
        <h4 className="text-blue-300 font-medium mb-2 text-base">
          {data.title || 'Unknown Event'}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-white font-medium">
              {data.total_events?.toLocaleString()} events
            </p>
            <p className="text-blue-200/90 text-sm mt-1">
              {data.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-500/20">
            <div>
              <p className="text-gray-400 text-xs">First seen:</p>
              <p className="text-white text-sm">
                {data.formattedFirstSeen}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Last seen:</p>
              <p className="text-white text-sm">
                {data.formattedLastSeen}
              </p>
            </div>
          </div>

          {data.tags && (
            <div className="pt-2 border-t border-blue-500/20">
              <p className="text-gray-400 text-xs mb-1">Tags:</p>
              <div className="flex flex-wrap gap-1">
                {data.tags.split(',').map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-1.5 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-black/40 border-blue-500/10">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-300">Event Severity Distribution</h3>
      </div>
      <div className="h-[400px]">
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
              width={400}
              stroke="#94A3B8"
              tick={{ fill: '#E2E8F0', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                fill: 'rgba(59, 130, 246, 0.1)',
                stroke: 'rgba(59, 130, 246, 0.2)',
                strokeWidth: 1
              }}
            />
            <Bar 
              dataKey="total_events" 
              radius={[0, 4, 4, 0]}
              barSize={30}
            >
              {transformedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={getSeverityColor(entry.rule_level)}
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#F97316]" />
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