import { Alert } from "./types";
import { ScrollArea } from "../ui/scroll-area";
import DetailHeader from "./TimelineDetails/DetailHeader";
import DetailDescription from "./TimelineDetails/DetailDescription";
import DetailGrid from "./TimelineDetails/DetailGrid";
import DetailTags from "./TimelineDetails/DetailTags";
import DetailRawData from "./TimelineDetails/DetailRawData";

interface TimelineDetailedLogsProps {
  alert: Alert;
  onClose: () => void;
}

const TimelineDetailedLogs = ({ alert, onClose }: TimelineDetailedLogsProps) => {
  return (
    <ScrollArea className="h-[800px]">
      <div className="bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        <DetailHeader title={alert.title} onClose={onClose} />
        
        <div className="p-8 space-y-8">
          <DetailDescription description={alert.description} />
          <DetailGrid data={alert} />
          <DetailTags tags={alert.tags} />
          <DetailRawData raw={alert.raw} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default TimelineDetailedLogs;