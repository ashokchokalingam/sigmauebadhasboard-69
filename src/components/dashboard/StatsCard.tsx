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
    <Card className="bg-[#1A1F2C]/80 border-blue-500/10 hover:bg-[#1E2235]/60 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-blue-200/80">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-blue-400/80" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-100">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-blue-300/70">
          <SubtitleIcon className="h-4 w-4" />
          <p>{subtitle}</p>
        </div>
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 space-y-2">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="flex justify-between items-center text-sm">
                <span className="text-blue-200/70">
                  {item.rule_level}
                </span>
                <span className="font-medium text-blue-100">
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