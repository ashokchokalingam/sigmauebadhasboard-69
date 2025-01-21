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
      case "high": return "#221F26";
      case "medium": return "#0FA0CE";
      case "low": return "#0EA5E9";
      case "risk": return "#0FA0CE";
      default: return "#0FA0CE";
    }
  };

  return (
    <div className="bg-[#1A1F2C]/95 backdrop-blur-sm border border-[#0FA0CE]/20 rounded-lg p-4 shadow-xl">
      <p className="text-[#0FA0CE] text-sm mb-2 font-medium">
        {format(new Date(label), "MMM d, yyyy")}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 text-sm">
          <span className="text-[#0FA0CE] flex items-center gap-2">
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