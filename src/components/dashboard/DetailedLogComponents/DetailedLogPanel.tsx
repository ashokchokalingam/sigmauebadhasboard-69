import { Alert } from "../types";
import { ScrollArea } from "../../ui/scroll-area";
import DetailHeader from "./DetailHeader";
import DetailedLogOverview from "./DetailedLogOverview";
import DetailedLogMitre from "./DetailedLogMitre";
import DetailedLogSystem from "./DetailedLogSystem";

interface DetailedLogPanelProps {
  alert: Alert;
  onClose: () => void;
}

const DetailedLogPanel = ({ alert, onClose }: DetailedLogPanelProps) => {
  return (
    <ScrollArea className="h-[800px]">
      <div className="p-6 space-y-6 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        <DetailHeader title={alert.title} onClose={onClose} />
        
        <div className="space-y-6">
          <DetailedLogOverview alert={alert} />
          <DetailedLogMitre alert={alert} />
          <DetailedLogSystem alert={alert} />
        </div>
      </div>
    </ScrollArea>
  );
};

export default DetailedLogPanel;