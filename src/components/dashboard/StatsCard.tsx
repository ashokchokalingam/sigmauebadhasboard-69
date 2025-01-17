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
    <Card className="bg-[#1A233A]/90 border-[#3A4A67] hover:bg-[#1A233A] transition-all duration-300 group backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-[#3A4A67] group-hover:text-white/80 transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white group-hover:text-white transition-colors">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-[#3A4A67] group-hover:text-white/70 transition-colors">
          <SubtitleIcon className="h-4 w-4" />
          <p>{subtitle}</p>
        </div>
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-2">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="flex justify-between items-center text-sm">
                <span className={`text-white/70 ${
                  item.rule_level.toLowerCase() === 'critical' 
                    ? 'text-[#FF4D4D] font-medium'
                    : item.rule_level.toLowerCase() === 'high'
                    ? 'text-[#FFA726] font-medium'
                    : 'text-[#66BB6A] font-medium'
                }`}>
                  {item.rule_level}
                </span>
                <span className={`font-medium ${
                  item.rule_level.toLowerCase() === 'critical'
                    ? 'text-[#FF4D4D]'
                    : item.rule_level.toLowerCase() === 'high'
                    ? 'text-[#FFA726]'
                    : 'text-[#66BB6A]'
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