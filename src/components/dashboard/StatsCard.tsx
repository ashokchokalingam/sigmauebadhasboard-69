
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  subtitleIcon: LucideIcon;
  breakdown?: { rule_level: string; event_count: number }[];
}

const StatsCard = ({ title, value, icon: Icon, subtitle, subtitleIcon: SubtitleIcon, breakdown }: StatsCardProps) => {
  // Helper function to get risk level colors
  const getRiskLevelStyles = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return 'text-[#ea384c] drop-shadow-[0_0_3px_rgba(234,56,76,0.3)]';
      case 'high':
        return 'text-[#F97316] drop-shadow-[0_0_3px_rgba(249,115,22,0.3)]';
      case 'medium':
        return 'text-[#FEC6A1] drop-shadow-[0_0_3px_rgba(254,198,161,0.3)]';
      case 'low':
        return 'text-[#4ADE80] drop-shadow-[0_0_3px_rgba(74,222,128,0.3)]';
      case 'origin':
        return 'text-[#60A5FA] drop-shadow-[0_0_3px_rgba(96,165,250,0.3)]';
      case 'impacted':
        return 'text-[#818CF8] drop-shadow-[0_0_3px_rgba(129,140,248,0.3)]';
      default:
        return 'text-white/90';
    }
  };

  return (
    <Card className="bg-[#15161E]/60 border border-[#5856D6]/20 hover:border-[#5856D6]/40 
    transition-all duration-300 group backdrop-blur-sm relative overflow-hidden
    shadow-lg shadow-[#5856D6]/5 hover:shadow-[#5856D6]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[18px] font-bold text-white/90 group-hover:text-white transition-colors tracking-tight">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-[#5856D6] group-hover:text-[#5856D6] transition-colors" />
      </CardHeader>
      
      <CardContent>
        <div className="text-[22px] font-bold text-white group-hover:text-white transition-colors tracking-tight tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        <div className="flex items-center gap-2 mt-3 text-[14px] text-white/80 font-medium group-hover:text-white/90 transition-colors">
          <SubtitleIcon className="h-4 w-4 text-[#5856D6]" />
          <p>{subtitle}</p>
        </div>
        
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="flex justify-between items-center">
                <span className={`text-[14px] font-bold ${getRiskLevelStyles(item.rule_level)}`}>
                  {item.rule_level}
                </span>
                <span className={`text-[16px] font-bold tabular-nums ${getRiskLevelStyles(item.rule_level)}`}>
                  {typeof item.event_count === 'number' ? item.event_count.toLocaleString() : item.event_count}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;

