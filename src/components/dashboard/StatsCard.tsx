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
    <Card className="relative overflow-hidden group">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-cyan-500/10 animate-pulse" />
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      
      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100/80 group-hover:text-blue-100 transition-colors">
            {title}
          </CardTitle>
          <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 bg-clip-text text-transparent animate-pulse">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="flex items-center gap-2 mt-2 text-blue-300/80">
            <SubtitleIcon className="h-4 w-4" />
            <p className="text-sm">{subtitle}</p>
          </div>
          {breakdown && breakdown.length > 0 && (
            <div className="mt-4 space-y-2">
              {breakdown.map((item) => (
                <div 
                  key={item.rule_level} 
                  className="flex justify-between items-center group/item hover:bg-white/5 p-1 rounded transition-colors"
                >
                  <span className="text-xs text-blue-200/70 group-hover/item:text-blue-200 transition-colors">
                    {item.rule_level}
                  </span>
                  <span className="text-xs font-mono text-blue-100/90 group-hover/item:text-blue-100 transition-colors">
                    {typeof item.event_count === 'number' ? item.event_count.toLocaleString() : item.event_count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border border-blue-500/20 group-hover:border-blue-400/30 rounded-lg transition-colors" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400/30 rounded-br-lg" />
    </Card>
  );
};

export default StatsCard;