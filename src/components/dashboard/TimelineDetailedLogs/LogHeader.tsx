import { Terminal } from "lucide-react";

interface LogHeaderProps {
  totalRecords?: number;
}

const LogHeader = ({ totalRecords }: LogHeaderProps) => {
  return (
    <div className="sticky top-0 z-20 p-4 flex justify-between items-center bg-gradient-to-r from-purple-900/50 via-blue-900/30 to-indigo-900/50 backdrop-blur-sm border-b border-purple-500/20">
      <div className="flex items-center gap-2">
        <Terminal className="h-5 w-5 text-purple-400" />
        <span className="text-lg font-semibold text-purple-100">
          Security Events Log ({totalRecords?.toLocaleString()})
        </span>
      </div>
    </div>
  );
};

export default LogHeader;