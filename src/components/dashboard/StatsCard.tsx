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
  const isPositive = subtitle.includes("+");
  
  return (
    <Card className="bg-[#1A1F2C]/40 border-0 hover:bg-[#1A1F2C]/60 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${
          title === "Active Users" ? "text-emerald-400" :
          title === "Average Risk Score" ? "text-amber-400" :
          "text-red-400"
        }`}>
          {value}
        </div>
        <div className="flex items-center mt-2">
          <SubtitleIcon className={`h-4 w-4 mr-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} />
          <p className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;