import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

interface SeverityData {
  user_impacted_timeline?: {
    description: string;
    first_time_seen: string;
    last_time_seen: string;
    rule_level: string;
    tags: string;
    title: string;
    total_events: number;
    user_impacted: string;
  }[];
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
      default: return '#94A3B8';
    }
  };

  // Transform the nested data structure
  const transformedData = severityData.flatMap(data => 
    data.user_impacted_timeline?.map(item => ({
      ...item,
      displayName: `${item.title || 'Unknown Event'} (${item.rule_level})`,
      formattedFirstSeen: format(new Date(item.first_time_seen), 'MMM dd, yyyy HH:mm'),
      formattedLastSeen: format(new Date(item.last_time_seen), 'MMM dd, yyyy HH:mm'),
    })) || []
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-black/90 p-4 rounded-lg shadow-xl border border-blue-500/20 backdrop-blur-sm">
        <div className="space-y-3">
          <div>
            <p className="text-white font-medium">
              {data.total_events?.toLocaleString()} events
            </p>
            <p className="text-blue-200/90 text-sm mt-1">
              {data.description}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-blue-200/70 text-xs">
              First seen: {data.formattedFirstSeen}
            </p>
            <p className="text-blue-200/70 text-xs">
              Last seen: {data.formattedLastSeen}
            </p>
          </div>

          {data.tags && (
            <div>
              <p className="text-blue-200/70 text-xs font-medium mb-1">Tags:</p>
              <div className="flex flex-wrap gap-1">
                {data.tags.split(',').map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-500/10 rounded text-xs text-blue-200/90"
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
    <div className="w-full">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              stroke="#475569"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={200}
              stroke="#475569"
              fontSize={12}
              tickFormatter={(value) => {
                if (value.length > 30) {
                  return value.substring(0, 30) + '...';
                }
                return value;
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
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
          </BarChart>
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
          <div className="w-3 h-3 rounded bg-[#10B981]" />
          <span className="text-sm text-blue-300/70">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#3B82F6]" />
          <span className="text-sm text-blue-300/70">Informational</span>
        </div>
      </div>
    </div>
  );
};

export default SeverityDistributionChart;