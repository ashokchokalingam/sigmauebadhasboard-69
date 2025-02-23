
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
  console.log('TimelineEventHeader props:', { ruleLevel, totalRecords, title });

  const getSeverityIcon = () => {
    switch (ruleLevel?.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-[#FF0000]" />;
      case 'high':
        return <ShieldAlert className="h-5 w-5 text-[#FFA500]" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-[#FFFF00]" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-[#008000]" />;
    }
  };

  const getSeverityColor = () => {
    switch (ruleLevel?.toLowerCase()) {
      case 'critical':
        return 'text-[#FF0000] bg-[#FF0000]/10';
      case 'high':
        return 'text-[#FFA500] bg-[#FFA500]/10';
      case 'medium':
        return 'text-[#FFFF00] bg-[#FFFF00]/10';
      default:
        return 'text-[#008000] bg-[#008000]/10';
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
          <span className="text-xs font-medium bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            {`${totalRecords} event${totalRecords !== 1 ? 's' : ''}`}
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
