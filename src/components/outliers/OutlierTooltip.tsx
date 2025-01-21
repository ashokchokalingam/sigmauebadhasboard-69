import { format } from "date-fns";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const getTimeOfDay = (hour: number): string => {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

export const OutlierTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  const date = new Date(label);
  const timeOfDay = getTimeOfDay(date.getHours());

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#ea384c';
      case 'high':
        return '#F97316';
      case 'medium':
        return '#0EA5E9';
      case 'low':
        return '#4ADE80';
      default:
        return '#9333EA';
    }
  };

  return (
    <div className="bg-[#1A1F2C]/95 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 shadow-xl">
      <p className="text-purple-200 text-sm mb-2 font-medium">
        {format(date, "MMM d, yyyy")} - {timeOfDay}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: getSeverityColor(data.severity) }}
        />
        <span className="text-purple-300 text-sm">
          Severity: {data.severity}
        </span>
      </div>
      <div className="text-white font-medium text-sm">
        {data.count} anomalies
      </div>
      {data.title && (
        <div className="text-purple-300 text-xs mt-2">
          {data.title}
        </div>
      )}
    </div>
  );
};