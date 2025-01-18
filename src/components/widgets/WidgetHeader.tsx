import { AlertTriangle } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  count: number;
}

const WidgetHeader = ({ title, count }: WidgetHeaderProps) => {
  return (
    <div className="p-4 bg-[#0A0B0F] border-b border-red-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-base font-medium text-red-400">
            {title}
          </span>
        </div>
        <span className="text-sm text-red-400">
          {count} critical users
        </span>
      </div>
    </div>
  );
};

export default WidgetHeader;