
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
  return (
    <Card className="bg-[#15161E]/60 border border-[#5856D6]/20 hover:border-[#5856D6]/40 
    transition-all duration-300 group backdrop-blur-sm relative overflow-hidden
    shadow-lg shadow-[#5856D6]/5 hover:shadow-[#5856D6]/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5856D6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-[#5856D6] group-hover:text-[#5856D6] transition-colors" />
      </CardHeader>
      
      <CardContent>
        <div className="text-3xl font-bold text-white group-hover:text-white transition-colors tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        <div className="flex items-center gap-2 mt-3 text-sm text-white/80 font-medium group-hover:text-white/90 transition-colors">
          <SubtitleIcon className="h-4 w-4 text-[#5856D6]" />
          <p>{subtitle}</p>
        </div>
        
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="flex justify-between items-center text-sm">
                <span className={`font-medium ${
                  title === "Risky Users (24h)" ? 'text-[#ea384c]' :
                  item.rule_level.toLowerCase() === 'critical' 
                    ? 'text-[#FF3B30] drop-shadow-[0_0_3px_rgba(255,59,48,0.3)]'
                    : item.rule_level.toLowerCase() === 'high'
                    ? 'text-[#FF9500] drop-shadow-[0_0_3px_rgba(255,149,0,0.3)]'
                    : 'text-[#34C759] drop-shadow-[0_0_3px_rgba(52,199,89,0.3)]'
                }`}>
                  {item.rule_level}
                </span>
                <span className={`font-semibold ${
                  title === "Risky Users (24h)" ? 'text-[#ea384c]' :
                  item.rule_level.toLowerCase() === 'critical'
                    ? 'text-[#FF3B30] drop-shadow-[0_0_3px_rgba(255,59,48,0.3)]'
                    : item.rule_level.toLowerCase() === 'high'
                    ? 'text-[#FF9500] drop-shadow-[0_0_3px_rgba(255,149,0,0.3)]'
                    : 'text-[#34C759] drop-shadow-[0_0_3px_rgba(52,199,89,0.3)]'
                }`}>
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
