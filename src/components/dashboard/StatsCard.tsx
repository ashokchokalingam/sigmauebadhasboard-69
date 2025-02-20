
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ShieldAlert, AlertTriangle, CheckCircle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  subtitleIcon: LucideIcon;
  breakdown?: { rule_level: string; event_count: number }[];
}

const StatsCard = ({ title, value, icon: Icon, subtitle, subtitleIcon: SubtitleIcon, breakdown }: StatsCardProps) => {
  const getRiskIcon = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel === 'critical') return <ShieldAlert className="h-4 w-4 text-[#FF3B30]" />;
    if (lowerLevel === 'high') return <AlertTriangle className="h-4 w-4 text-[#FF9500]" />;
    return <CheckCircle className="h-4 w-4 text-[#34C759]" />;
  };

  const getRiskColors = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (title === "Risky Users (24h)") {
      return {
        bg: 'bg-[#ea384c]/10',
        text: 'text-[#ea384c]',
        border: 'border-[#ea384c]/30'
      };
    }
    
    switch (lowerLevel) {
      case 'critical':
        return {
          bg: 'bg-[#FF3B30]/10',
          text: 'text-[#FF3B30]',
          border: 'border-[#FF3B30]/30'
        };
      case 'high':
        return {
          bg: 'bg-[#FF9500]/10',
          text: 'text-[#FF9500]',
          border: 'border-[#FF9500]/30'
        };
      default:
        return {
          bg: 'bg-[#34C759]/10',
          text: 'text-[#34C759]',
          border: 'border-[#34C759]/30'
        };
    }
  };

  return (
    <Card className="bg-[#15161E]/60 border border-[#5856D6]/20 hover:border-[#5856D6]/40 
    transition-all duration-300 group backdrop-blur-sm relative overflow-hidden
    shadow-lg shadow-[#5856D6]/5 hover:shadow-[#5856D6]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-white/90 group-hover:text-white transition-colors">
          {title}
        </CardTitle>
        <Icon className="h-6 w-6 text-[#5856D6] group-hover:text-[#5856D6] transition-colors" />
      </CardHeader>
      
      <CardContent>
        <div className="text-4xl font-bold text-white group-hover:text-white transition-colors tracking-tight mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-sm text-white/80 font-medium group-hover:text-white/90 transition-colors">
          <SubtitleIcon className="h-4 w-4 text-[#5856D6]" />
          <p className="text-[15px]">{subtitle}</p>
        </div>
        
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-3">
            {breakdown.map((item) => {
              const colors = getRiskColors(item.rule_level);
              return (
                <div key={item.rule_level} 
                  className={`flex justify-between items-center p-2 rounded-lg border ${colors.border} ${colors.bg}`}
                >
                  <div className="flex items-center gap-2">
                    {getRiskIcon(item.rule_level)}
                    <span className={`font-medium text-[13px] ${colors.text}`}>
                      {item.rule_level}
                    </span>
                  </div>
                  <span className={`font-semibold text-[13px] ${colors.text}`}>
                    {typeof item.event_count === 'number' ? item.event_count.toLocaleString() : item.event_count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
