import { Shield, AlertTriangle, Activity, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEventHeaderProps {
  ruleLevel?: string;
  totalRecords: number;
  title: string;
  description: string;
}

const TimelineEventHeader = ({ ruleLevel, totalRecords, title, description }: TimelineEventHeaderProps) => {
  const getSeverityIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-400" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getSeverityIcon(ruleLevel)}
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            ruleLevel?.toLowerCase() === 'high' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
            ruleLevel?.toLowerCase() === 'medium' && "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
            ruleLevel?.toLowerCase() === 'informational' && "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          )}>
            {ruleLevel?.toUpperCase() || 'INFO'}
          </span>
          <div className="flex items-center gap-2 text-sm text-green-400/70">
            <Activity className="h-4 w-4" />
            <span>{totalRecords} events</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-blue-100 mb-2 group-hover:text-blue-300 transition-colors">
          {title || "Unknown Event"}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {description || "No description available"}
        </p>
      </div>
    </>
  );
};

export default TimelineEventHeader;