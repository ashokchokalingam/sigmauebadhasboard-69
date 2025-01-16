import { Activity } from "lucide-react";

interface LogHeaderProps {
  totalRecords?: number;
}

const LogHeader = ({ totalRecords }: LogHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-100">Detailed Logs</h3>
      </div>
      {totalRecords !== undefined && (
        <span className="text-sm text-purple-300/70">
          {totalRecords.toLocaleString()} records
        </span>
      )}
    </div>
  );
};

export default LogHeader;