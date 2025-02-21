
import { Card } from "@/components/ui/card";
import { AlertOctagon, AlertTriangle, Shield, Users, Monitor, Workflow } from "lucide-react";
import { AlertStats } from "./types";
import { cn } from "@/lib/utils";

interface StatsSectionProps {
  stats: AlertStats;
  totalAlerts: number;
}

const StatsSection = ({ stats, totalAlerts }: StatsSectionProps) => {
  const categories = [
    {
      title: "Critical Alerts",
      count: stats.critical,
      color: "from-[#FF3B30] to-[#FF453A]",
      borderColor: "border-red-500/20",
      hoverBorderColor: "group-hover:border-red-500/40",
      icon: AlertOctagon,
      description: "High-priority security events requiring immediate attention",
      secondaryMetric: `${((stats.critical / totalAlerts) * 100).toFixed(1)}% of total`,
      ringColor: "ring-red-500/20",
      textGradient: "from-red-500 via-red-400 to-red-300"
    },
    {
      title: "High Risk Events",
      count: stats.high,
      color: "from-[#FF9500] to-[#FFA724]",
      borderColor: "border-orange-500/20",
      hoverBorderColor: "group-hover:border-orange-500/40",
      icon: AlertTriangle,
      description: "Significant security concerns needing investigation",
      secondaryMetric: `${((stats.high / totalAlerts) * 100).toFixed(1)}% of total`,
      ringColor: "ring-orange-500/20",
      textGradient: "from-orange-500 via-orange-400 to-orange-300"
    },
    {
      title: "Systems Affected",
      count: stats.systems || 0,
      color: "from-[#32D74B] to-[#34C759]",
      borderColor: "border-green-500/20",
      hoverBorderColor: "group-hover:border-green-500/40",
      icon: Monitor,
      description: "Total number of impacted systems",
      secondaryMetric: "Active monitoring",
      ringColor: "ring-green-500/20",
      textGradient: "from-green-500 via-green-400 to-green-300"
    },
    {
      title: "Users at Risk",
      count: stats.users || 0,
      color: "from-[#0A84FF] to-[#007AFF]",
      borderColor: "border-blue-500/20",
      hoverBorderColor: "group-hover:border-blue-500/40",
      icon: Users,
      description: "Users requiring security review",
      secondaryMetric: "Under observation",
      ringColor: "ring-blue-500/20",
      textGradient: "from-blue-500 via-blue-400 to-blue-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.title} 
            className={cn(
              "relative group overflow-hidden",
              "border bg-black/40 backdrop-blur-sm",
              category.borderColor,
              category.hoverBorderColor,
              "transition-all duration-300 ease-in-out",
              "hover:scale-102 hover:shadow-lg",
              category.ringColor
            )}
          >
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br" 
              style={{
                background: `radial-gradient(circle at bottom right, var(--${category.color.split('-')[1]}) 0%, transparent 70%)`
              }}
            />
            
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  `bg-gradient-to-br ${category.color}`,
                  "bg-opacity-10"
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm text-gray-400">{category.secondaryMetric}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium text-gray-200">
                  {category.title}
                </h3>
                <div className="flex items-end gap-2">
                  <span className={cn(
                    "text-3xl font-bold tracking-tight",
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    category.textGradient
                  )}>
                    {category.count.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-30 
                transition-opacity group-hover:opacity-50"
                style={{
                  background: `linear-gradient(to right, var(--${category.color.split('-')[1]}), transparent)`
                }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSection;
