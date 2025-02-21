
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, AlertTriangle, ShieldX, AlertOctagon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  breakdown?: { rule_level: string; event_count: number }[];
}

const StatsCard = ({ title, value, icon: Icon, subtitle, breakdown }: StatsCardProps) => {
  const getRiskColors = (level: string) => {
    const lowerLevel = level.toLowerCase();
    switch (lowerLevel) {
      case 'critical':
        return {
          bg: 'bg-[#ff6b6b]/10',
          text: 'text-[#ff6b6b]',
          border: 'border-[#ff6b6b]/20',
          hover: 'group-hover:border-[#ff6b6b]/40',
          glow: 'group-hover:shadow-[#ff6b6b]/20',
          icon: <ShieldX className="h-4 w-4" />
        };
      case 'high':
        return {
          bg: 'bg-[#ff9f43]/10',
          text: 'text-[#ff9f43]',
          border: 'border-[#ff9f43]/20',
          hover: 'group-hover:border-[#ff9f43]/40',
          glow: 'group-hover:shadow-[#ff9f43]/20',
          icon: <AlertTriangle className="h-4 w-4" />
        };
      case 'users':
        return {
          bg: 'bg-[#ff6b6b]/10',
          text: 'text-[#ff6b6b]',
          border: 'border-[#ff6b6b]/20',
          hover: 'group-hover:border-[#ff6b6b]/40',
          glow: 'group-hover:shadow-[#ff6b6b]/20',
          icon: <AlertOctagon className="h-4 w-4" />
        };
      case 'systems':
        return {
          bg: 'bg-[#5856D6]/10',
          text: 'text-[#5856D6]',
          border: 'border-[#5856D6]/20',
          hover: 'group-hover:border-[#5856D6]/40',
          glow: 'group-hover:shadow-[#5856D6]/20',
          icon: <AlertOctagon className="h-4 w-4" />
        };
      case 'origin':
      case 'impacted':
        return {
          bg: 'bg-[#34C759]/10',
          text: 'text-[#34C759]',
          border: 'border-[#34C759]/20',
          hover: 'group-hover:border-[#34C759]/40',
          glow: 'group-hover:shadow-[#34C759]/20',
          icon: <AlertOctagon className="h-4 w-4" />
        };
      default:
        return {
          bg: 'bg-[#34C759]/10',
          text: 'text-[#34C759]',
          border: 'border-[#34C759]/20',
          hover: 'group-hover:border-[#34C759]/40',
          glow: 'group-hover:shadow-[#34C759]/20',
          icon: <AlertOctagon className="h-4 w-4" />
        };
    }
  };

  return (
    <Card className="bg-[#0A0B0F] border-0 rounded-2xl transition-all duration-300 
      group hover:shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/5 via-transparent to-transparent opacity-0 
        group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-7">
        <div className="flex items-center justify-between mb-5">
          <Icon className="h-6 w-6 text-[#5856D6]" />
          <h3 className="text-[15px] font-medium text-white/90">{title}</h3>
        </div>

        <div className="mb-5">
          <div className="text-[42px] font-bold text-white tracking-tight mb-2 leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className="text-[13px] text-white/60 font-medium">{subtitle}</p>
        </div>

        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2.5">
            {breakdown.map((item) => {
              const colors = getRiskColors(item.rule_level);
              return (
                <TooltipProvider key={item.rule_level}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`flex items-center justify-between p-2.5 rounded-xl border 
                          ${colors.bg} ${colors.border} ${colors.hover}
                          transition-all duration-300 cursor-pointer
                          hover:shadow-md ${colors.glow}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={colors.text}>{colors.icon}</span>
                          <span className={`text-sm font-medium ${colors.text}`}>
                            {item.rule_level}
                          </span>
                        </div>
                        <span className={`font-semibold ${colors.text}`}>
                          {typeof item.event_count === 'number' ? item.event_count.toLocaleString() : item.event_count}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-[#1A1B23] border border-[#5856D6]/20 p-3 rounded-lg shadow-xl"
                    >
                      <p className="text-sm text-white">
                        {item.rule_level === 'Critical' || item.rule_level === 'High'
                          ? `${item.event_count} ${item.rule_level.toLowerCase()} severity alerts detected in the last 24h`
                          : `${item.event_count} ${item.rule_level.toLowerCase()} events recorded`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
