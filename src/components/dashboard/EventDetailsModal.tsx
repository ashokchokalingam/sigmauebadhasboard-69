
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert } from "./types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
  user_origin_logs: Alert[];
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleViewMore = () => {
    // Navigate to full page view
    window.open(`/alert/${event.id}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 bg-[#1A1F2C] border-[#5856D6]/20">
        <Tabs defaultValue="overview" className="w-full h-full">
          <div className="border-b border-[#5856D6]/20 px-6 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              <Button 
                variant="outline" 
                className="bg-[#5856D6]/10 border-[#5856D6]/30 text-[#5856D6] hover:bg-[#5856D6]/20"
                onClick={handleViewMore}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Analysis
              </Button>
            </div>
            <TabsList className="bg-[#2B2B3B] border border-[#5856D6]/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
              <TabsTrigger value="raw">Raw Log</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <TabsContent value="overview" className="mt-0">
              <div className="grid gap-6">
                <div className="bg-[#2B2B3B] rounded-lg p-6 border border-[#5856D6]/20">
                  <h3 className="text-lg font-medium text-white mb-4">Event Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Risk Level</p>
                      <p className={cn("text-lg font-medium", getRiskLevelColor(event.rule_level))}>
                        {event.rule_level || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">User Origin</p>
                      <p className="text-lg font-medium text-white">{event.user_origin || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">First Seen</p>
                      <p className="text-lg font-medium text-white">
                        {formatTimestamp(event.first_time_seen || event.system_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Seen</p>
                      <p className="text-lg font-medium text-white">
                        {formatTimestamp(event.last_time_seen || event.system_time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2B2B3B] rounded-lg p-6 border border-[#5856D6]/20">
                  <h3 className="text-lg font-medium text-white mb-4">Description</h3>
                  <p className="text-gray-300">{event.description}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mitre" className="mt-0">
              <div className="bg-[#2B2B3B] rounded-lg p-6 border border-[#5856D6]/20">
                <h3 className="text-lg font-medium text-white mb-6">MITRE ATT&CK Analysis</h3>
                <div className="grid gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Tactics</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags?.split(',')
                        .filter(tag => tag.includes('attack.') && !tag.toLowerCase().includes('t1'))
                        .map((tactic, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#5856D6]/10 text-[#5856D6] rounded-full 
                              border border-[#5856D6]/30 text-sm"
                          >
                            {tactic.replace('attack.', '').split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Techniques</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags?.split(',')
                        .filter(tag => tag.toLowerCase().includes('t1'))
                        .map((technique, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full 
                              border border-blue-500/30 text-sm"
                          >
                            {technique.trim().toUpperCase()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="mt-0">
              <div className="bg-[#2B2B3B] rounded-lg border border-[#5856D6]/20">
                <div className="bg-[#1E1E2F] p-4 rounded-t-lg border-b border-[#5856D6]/20">
                  <h3 className="text-lg font-medium text-white">Raw Log Data</h3>
                </div>
                <div className="p-6">
                  <pre className="overflow-auto max-h-[500px] rounded-lg bg-[#1E1E2F] p-4">
                    <code ref={codeRef} className="language-json">
                      {typeof event.raw === 'string' 
                        ? event.raw 
                        : JSON.stringify(event.raw, null, 2)}
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
