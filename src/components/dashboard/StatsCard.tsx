import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  subtitleIcon: LucideIcon;
}

const StatsCard = ({ title, value, icon: Icon, subtitle, subtitleIcon: SubtitleIcon }: StatsCardProps) => {
  return (
    <Card className="bg-black/40 border border-blue-500/10 hover:bg-black/50 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-red-400">
          {value}
        </div>
        <div className="flex items-center mt-2">
          <SubtitleIcon className="h-4 w-4 mr-1 text-red-400" />
          <p className="text-xs text-red-400">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;