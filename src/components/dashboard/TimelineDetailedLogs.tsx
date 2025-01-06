import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import DetailHeader from "./TimelineDetails/DetailHeader";
import DetailDescription from "./TimelineDetails/DetailDescription";
import DetailGrid from "./TimelineDetails/DetailGrid";
import DetailTags from "./TimelineDetails/DetailTags";
import DetailRawData from "./TimelineDetails/DetailRawData";

interface TimelineDetailedLogsProps {
  logs: Alert[];
  isLoading: boolean;
  totalRecords: number;
}

const TimelineDetailedLogs = ({ logs, isLoading, totalRecords }: TimelineDetailedLogsProps) => {
  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[800px]">
      <div className="bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        {logs.map((log, index) => (
          <div key={`${log.id}-${index}`} className="border-b border-blue-500/10 last:border-0">
            <DetailHeader title={log.title} />
            
            <div className="p-8 space-y-8">
              <DetailDescription description={log.description} />
              <DetailGrid data={log} />
              <DetailTags tags={log.tags} />
              <DetailRawData raw={log.raw} />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TimelineDetailedLogs;