
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert } from "./types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Watch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Alert;
}

interface LogsResponse {
  alerts: Alert[];
  pagination: {
    current_page: number;
    per_page: number;
    total_records: number;
    has_more: boolean;
  };
}

const EventDetailsModal = ({ isOpen, onClose, event }: EventDetailsModalProps) => {
  const codeRef = useRef<HTMLElement>(null);

  const { data: logsData, isLoading } = useQuery<LogsResponse>({
    queryKey: [`modal-logs-${event.id}`],
    queryFn: async () => {
      const params = new URLSearchParams({
        user_origin: event.user_origin || '',
        title: event.title || ''
      });
      
      const response = await fetch(`/api/alerts?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return response.json();
    },
    enabled: isOpen,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (codeRef.current && event.raw) {
      Prism.highlightElement(codeRef.current);
    }
  }, [event.raw, isOpen]);

  const getRiskLevelColor = (level: string = '') => {
    switch (level.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-full p-0 m-0 bg-[#1A1F2C] border-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#1E1E2F] border-b border-[#5856D6]/20">
            <div className="flex items-center gap-2">
              <Watch className="w-5 h-5 text-[#9b87f5]" />
              <h2 className="text-lg font-semibold text-[#9b87f5]">Chrono Analyzer</h2>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#33C3F0]/10 text-[#33C3F0]/70 border-[#33C3F0]/20 hover:bg-[#33C3F0]/20 hover:text-[#33C3F0]"
              >
                Anomalies
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#33C3F0]/10 text-[#33C3F0] border-[#33C3F0]/30 shadow-[0_0_10px_rgba(51,195,240,0.2)]"
              >
                ML Outliers
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0A0D14] text-sm font-medium text-slate-300 border-b border-slate-800">
            <div className="col-span-1">Time</div>
            <div className="col-span-1">User Origin</div>
            <div className="col-span-1">User Impacted</div>
            <div className="col-span-2">Title</div>
            <div className="col-span-2">Computer</div>
            <div className="col-span-2">Description</div>
            <div className="col-span-1">IP Address</div>
            <div className="col-span-1">Rule Level</div>
            <div className="col-span-1">Risk Score</div>
          </div>

          {/* Table Content */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800/50 hover:bg-slate-800/20">
              <div className="col-span-1 text-sm text-slate-300">
                {formatTimestamp(event.system_time)}
              </div>
              <div className="col-span-1 text-sm text-slate-300">
                {event.user_origin || 'N/A'}
              </div>
              <div className="col-span-1 text-sm text-slate-300">
                {event.target_user_name || 'none'}
              </div>
              <div className="col-span-2 text-sm text-slate-300">
                {event.title}
              </div>
              <div className="col-span-2 text-sm text-slate-300">
                {event.computer_name || 'N/A'}
              </div>
              <div className="col-span-2 text-sm text-slate-300 truncate">
                {event.description}
              </div>
              <div className="col-span-1 text-sm text-slate-300">
                {event.ip_address || 'none'}
              </div>
              <div className="col-span-1">
                <span className={cn("text-sm font-medium", getRiskLevelColor(event.rule_level))}>
                  {event.rule_level || 'unknown'}
                </span>
              </div>
              <div className="col-span-1">
                <span className={cn("text-sm font-medium", getRiskScoreColor(event.risk || 0))}>
                  {event.risk || 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
