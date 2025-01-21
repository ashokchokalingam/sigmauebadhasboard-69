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
    switch (name.toLowerCase()) {
      case "high": return "#FF4444";
      case "medium": return "#FFA500";
      case "low": return "#4ADE80";
      case "risk": return "#8884d8";
      default: return "#94A3B8";
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
      <p className="text-gray-400 text-sm mb-2">
        {format(new Date(label), "MMM d, yyyy")}
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
    </div>
  );
};