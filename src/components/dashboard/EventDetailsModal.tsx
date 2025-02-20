
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert } from "./types";
import { useQuery } from "@tanstack/react-query";
import { ChronoAnalyzerHeader } from "./ChronoAnalyzer/Header";
import { ChronoAnalyzerTableHeader } from "./ChronoAnalyzer/TableHeader";
import { ChronoAnalyzerTableRow } from "./ChronoAnalyzer/TableRow";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Alert;
}

interface LogsResponse {
  user_origin_logs: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_records: number;
  };
}

const EventDetailsModal = ({ isOpen, onClose, event }: EventDetailsModalProps) => {
  const { data: logsData, isLoading } = useQuery<LogsResponse>({
    queryKey: [`modal-logs-${event.id}`],
    queryFn: async () => {
      const params = new URLSearchParams({
        user_origin: event.user_origin || '',
        title: event.title || ''
      });
      
      const response = await fetch(`/api/user_origin_logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return response.json();
    },
    enabled: isOpen,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-full p-0 m-0 bg-[#1A1F2C] border-0">
        <div className="flex flex-col h-full">
          <ChronoAnalyzerHeader />
          <ChronoAnalyzerTableHeader />
          <div className="flex-1 overflow-auto">
            {logsData?.user_origin_logs.map((logEvent, index) => (
              <ChronoAnalyzerTableRow key={logEvent.id || index} event={logEvent} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
