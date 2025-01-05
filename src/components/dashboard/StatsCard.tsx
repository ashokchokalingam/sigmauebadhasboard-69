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
    <Card className="stats-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-stats-text/80">
          {title}
        </CardTitle>
        <Icon className="stats-icon h-5 w-5 text-stats-accent" />
      </CardHeader>
      <CardContent>
        <div className="stats-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="stats-subtitle">
          <SubtitleIcon className="h-4 w-4" />
          <p>{subtitle}</p>
        </div>
        {breakdown && breakdown.length > 0 && (
          <div className="stats-breakdown">
            {breakdown.map((item) => (
              <div key={item.rule_level} className="stats-breakdown-item">
                <span className="stats-breakdown-label">
                  {item.rule_level}
                </span>
                <span className="stats-breakdown-value">
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