import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface TimelineEventHeaderProps {
  ruleLevel?: string;
  totalRecords: number;
  title: string;
  description: string;
}

const TimelineEventHeader = ({
  ruleLevel = 'medium',
  totalRecords,
  title,
  description
}: TimelineEventHeaderProps) => {
  const getSeverityIcon = () => {
    switch (ruleLevel?.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'high':
        return <ShieldAlert className="h-5 w-5 text-orange-400" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-yellow-400" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-green-400" />;
    }
  };

  const getSeverityColor = () => {
    switch (ruleLevel?.toLowerCase()) {
      case 'critical':
        return 'text-red-400 bg-red-400/10';
      case 'high':
        return 'text-orange-400 bg-orange-400/10';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10';
      default:
        return 'text-green-400 bg-green-400/10';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getSeverityIcon()}
          <span className={cn(
            "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
            getSeverityColor()
          )}>
            {ruleLevel}
          </span>
          <span className="text-xs text-blue-400 bg-blue-400/10 px-2.5 py-0.5 rounded-full">
            {totalRecords || 0} events
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-blue-100">{title}</h3>
        <p className="text-sm text-blue-300/70">{description}</p>
      </div>
    </div>
  );
};

export default TimelineEventHeader;