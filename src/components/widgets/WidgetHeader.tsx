import { AlertTriangle } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  count: number;
}

const WidgetHeader = ({ title, count }: WidgetHeaderProps) => {
  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border-b border-indigo-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400">
          {count} critical users
        </span>
      </div>
    </div>
  );
};

export default WidgetHeader;