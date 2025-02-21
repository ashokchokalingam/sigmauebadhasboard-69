
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
        return 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20';
      case 'high':
        return 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20';
      case 'users':
        return 'bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20';
      case 'systems':
        return 'bg-[#5856D6]/10 text-[#5856D6] border-[#5856D6]/20';
      case 'origin':
      case 'impacted':
        return 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20';
      default:
        return 'bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20';
    }
  };

  return (
    <Card className="bg-[#0A0B0F] border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Icon className="h-6 w-6 text-[#5856D6]" />
          <h3 className="text-base font-medium text-white/90">{title}</h3>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold text-white mb-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <p className="text-sm text-white/60">{subtitle}</p>
        </div>

        {breakdown && breakdown.length > 0 && (
          <div className="space-y-2">
            {breakdown.map((item) => {
              const colorClasses = getRiskColors(item.rule_level);
              return (
                <div
                  key={item.rule_level}
                  className={`flex items-center justify-between p-2 rounded border ${colorClasses}`}
                >
                  <span className="text-sm">{item.rule_level}</span>
                  <span className="font-medium">
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
