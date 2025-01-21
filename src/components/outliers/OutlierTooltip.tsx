import { format } from "date-fns";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const OutlierTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload) return null;

  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  const getColor = (name: string) => {
    switch (name) {
      case "High Severity": return "#EF4444";
      case "Medium Severity": return "#F59E0B";
      case "Low Severity": return "#10B981";
      default: return "#94A3B8";
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
      <p className="text-gray-400 text-sm mb-2">
        {format(new Date(label), "MMM d, yyyy HH:mm")}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-gray-400 flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getColor(entry.name) }}
            />
            {entry.name}:
          </span>
          <span className="text-white font-medium">
            {formatValue(entry.value)}
          </span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-800">
        <div className="text-sm text-gray-400">
          Total: {formatValue(payload.reduce((sum, entry) => sum + entry.value, 0))}
        </div>
      </div>
    </div>
  );
};