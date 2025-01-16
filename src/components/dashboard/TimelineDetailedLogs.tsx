import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import LogHeader from "./TimelineDetailedLogs/LogHeader";
import LogItem from "./TimelineDetailedLogs/LogItem";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading?: boolean;
  totalRecords?: number;
  entityType?: "user" | "computer";
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Card className="border border-purple-500/20 bg-[#1A1F2C] overflow-hidden">
        <LogHeader totalRecords={totalRecords} />
        <ScrollArea className="h-[800px]">
          <div className="space-y-1 p-2">
            {logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default TimelineDetailedLogs;