import { AlertTriangle } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  count: number;
}

const WidgetHeader = ({ title, count }: WidgetHeaderProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-[#0A0B0F] to-[#12131A] border-b border-red-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500 rounded-full blur opacity-25"></div>
            <AlertTriangle className="relative h-5 w-5 text-red-400" />
          </div>
          <span className="text-base font-medium text-red-400">
            {title}
          </span>
        </div>
        <span className="px-3 py-1 text-sm text-red-400 bg-red-500/10 rounded-full border border-red-500/20">
          {count} critical
        </span>
      </div>
    </div>
  );
};

export default WidgetHeader;