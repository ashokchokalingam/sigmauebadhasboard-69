
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
    if (lowerLevel === 'critical') return <ShieldAlert className="h-4 w-4 text-[#ea384c]" />;
    if (lowerLevel === 'high') return <AlertTriangle className="h-4 w-4 text-[#F97316]" />;
    return <CheckCircle className="h-4 w-4 text-[#34C759]" />;
  };

  const getRiskColors = (level: string) => {
    const lowerLevel = level.toLowerCase();
    if (title === "Risky Users (24h)") {
      return {
        bg: 'bg-[#ea384c]/5',
        text: 'text-[#ea384c]',
        border: 'border-[#ea384c]/20',
        bar: 'bg-[#ea384c]'
      };
    }
    
    switch (lowerLevel) {
      case 'critical':
        return {
          bg: 'bg-[#ea384c]/5',
          text: 'text-[#ea384c]',
          border: 'border-[#ea384c]/20',
          bar: 'bg-[#ea384c]'
        };
      case 'high':
        return {
          bg: 'bg-[#F97316]/5',
          text: 'text-[#F97316]',
          border: 'border-[#F97316]/20',
          bar: 'bg-[#F97316]'
        };
      default:
        return {
          bg: 'bg-[#34C759]/5',
          text: 'text-[#34C759]',
          border: 'border-[#34C759]/20',
          bar: 'bg-[#34C759]'
        };
    }
  };

  // Convert value to number for calculations
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  return (
    <Card className="bg-[#0A0B0F] border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/70">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-white/40" />
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold text-white mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
          <SubtitleIcon className="h-3.5 w-3.5" />
          <p>{subtitle}</p>
        </div>
        
        {breakdown && breakdown.length > 0 && (
          <div className="space-y-3">
            {breakdown.map((item) => {
              const colors = getRiskColors(item.rule_level);
              const percentage = numericValue > 0 ? (item.event_count / numericValue) * 100 : 0;
              
              return (
                <div key={item.rule_level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(item.rule_level)}
                      <span className={`${colors.text} font-medium`}>
                        {item.rule_level}
                      </span>
                    </div>
                    <span className={`${colors.text} font-mono tabular-nums`}>
                      {typeof item.event_count === 'number' ? item.event_count.toLocaleString() : item.event_count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors.bar} rounded-full transition-all duration-500`}
                      style={{ 
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>
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
