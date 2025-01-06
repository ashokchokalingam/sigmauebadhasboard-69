import { X } from "lucide-react";
import { Alert } from "../types";
import { ScrollArea } from "../../ui/scroll-area";
import DetailedLogOverview from "./DetailedLogOverview";
import DetailedLogMitre from "./DetailedLogMitre";
import DetailedLogSystem from "./DetailedLogSystem";
import { extractTacticsAndTechniques } from "../utils";

interface DetailedLogPanelProps {
  alert: Alert;
  onClose: () => void;
}

const DetailedLogPanel = ({ alert, onClose }: DetailedLogPanelProps) => {
  const { tactics, techniques } = extractTacticsAndTechniques(alert.tags);
  const rawData = typeof alert.raw === 'string' ? JSON.parse(alert.raw) : alert.raw;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
      <div className="flex items-center justify-between p-4 border-b border-purple-500/10">
        <h2 className="text-lg font-semibold text-purple-100">Event Details</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-purple-400" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <DetailedLogOverview alert={alert} />
          <DetailedLogMitre alert={alert} />
          <DetailedLogSystem alert={alert} />

          {rawData && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-purple-400">Raw Event Data</h3>
              <pre className="p-4 bg-black/40 rounded-lg text-xs text-purple-100/90 overflow-x-auto">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DetailedLogPanel;