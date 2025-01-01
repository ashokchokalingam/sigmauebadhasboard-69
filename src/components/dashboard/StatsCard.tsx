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
    <Card className="bg-black/40 border-0 hover:bg-black/50 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-red-400">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center mt-2">
          <SubtitleIcon className="h-4 w-4 mr-1 text-red-400" />
          <p className="text-xs text-red-400">
            {subtitle}
          </p>
        </div>
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-2">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{item.rule_level}</span>
                <span className="text-red-400 font-semibold">
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