import { Alert } from "./types";
import { X, FileText, Target, Shield, Hash, Terminal, Clock, Computer, User, Network, AlertTriangle } from "lucide-react";
import { useState } from "react";
import TimelineRawLog from "./TimelineRawLog";
import { allColumns } from "./TableConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface AlertDetailsViewProps {
  alert: Alert;
  onClose: () => void;
}

const AlertDetailsView = ({ alert, onClose }: AlertDetailsViewProps) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const getIconForField = (key: string) => {
    switch (key) {
      case "title": return <FileText className="h-5 w-5 text-blue-400" />;
      case "description": return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case "tags": return <Target className="h-5 w-5 text-purple-400" />;
      case "system_time": return <Clock className="h-5 w-5 text-green-400" />;
      case "computer_name": return <Computer className="h-5 w-5 text-cyan-400" />;
      case "user_id": return <User className="h-5 w-5 text-indigo-400" />;
      case "ip_address": return <Network className="h-5 w-5 text-pink-400" />;
      case "ruleid": return <Hash className="h-5 w-5 text-orange-400" />;
      default: return <Shield className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={100} minSize={30}>
        <div className="fixed top-0 right-0 h-screen w-[600px] z-50 shadow-2xl">
          <ScrollArea className="h-[calc(100vh-2rem)] w-full bg-black/90 backdrop-blur-md border-l border-blue-500/10">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Alert Details
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-blue-400" />
                </button>
              </div>

              {/* Title Section */}
              <div className="space-y-2 border-b border-blue-500/10 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-blue-100">{alert.title}</h3>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2 border-b border-blue-500/10 pb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <h4 className="text-lg font-medium text-yellow-100">Description</h4>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed pl-8">
                  {alert.description || 'No description available'}
                </p>
              </div>

              {/* MITRE ATT&CK Section */}
              <div className="space-y-4 border-b border-blue-500/10 pb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-purple-400" />
                  <h4 className="text-lg font-medium text-purple-100">MITRE ATT&CK</h4>
                </div>
                <div className="pl-8 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {alert.tags?.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                {allColumns
                  .filter(col => !['title', 'description', 'tags'].includes(col.key))
                  .map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getIconForField(key)}
                        <h4 className="text-sm font-medium text-blue-300">{label}</h4>
                      </div>
                      <p className="text-blue-100 pl-7">
                        {alert[key as keyof Alert]?.toString() || 'N/A'}
                      </p>
                    </div>
                ))}
              </div>
              
              {/* Raw Data Section */}
              <div className="mt-6 border-t border-blue-500/10 pt-4">
                <button
                  className="w-full flex items-center gap-2 p-4 hover:bg-blue-500/5 transition-colors rounded-lg"
                  onClick={() => setIsRawExpanded(!isRawExpanded)}
                >
                  <Terminal className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-semibold text-green-100">Raw Data</span>
                </button>
                {isRawExpanded && alert.raw && (
                  <div className="mt-4">
                    <TimelineRawLog alert={alert} />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AlertDetailsView;