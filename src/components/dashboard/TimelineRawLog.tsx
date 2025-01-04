import { Terminal, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import { Alert } from "./types";
import { cn } from "@/lib/utils";

interface TimelineRawLogProps {
  alert: Alert;
}

const TimelineRawLog = ({ alert }: TimelineRawLogProps) => {
  const codeRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (codeRef.current && isExpanded) {
      Prism.highlightElement(codeRef.current);
    }
  }, [alert.raw, isExpanded]);

  if (!alert.raw) {
    return (
      <div className="p-4 text-purple-400 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        No raw log data available
      </div>
    );
  }

  let formattedJson;
  try {
    formattedJson = typeof alert.raw === 'string' 
      ? JSON.stringify(JSON.parse(alert.raw), null, 2)
      : JSON.stringify(alert.raw, null, 2);
  } catch (e) {
    formattedJson = typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw);
  }

  return (
    <div className="w-full">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-4 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform duration-200",
          isExpanded && "transform rotate-90"
        )} />
        <span className="font-mono text-sm">{">"}_</span>
        Raw Log
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[500px]" : "max-h-0"
      )}>
        <div className="bg-[#1A1F2C]/80 backdrop-blur-sm rounded-lg border border-purple-500/20 transition-all duration-200 hover:border-purple-500/30 m-4">
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(139, 92, 246, 0.1);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(139, 92, 246, 0.3);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(139, 92, 246, 0.4);
              }
              .raw-log-content {
                color: #FFFFFF;
              }
              .raw-log-content .token.property {
                color: #00FF00;
              }
              .raw-log-content .token.string {
                color: #FFFF99;
              }
              .raw-log-content .token.number {
                color: #FFA500;
              }
              .raw-log-content .token.boolean {
                color: #1E90FF;
              }
              .raw-log-content .token.null {
                color: #A9A9A9;
              }
              .raw-log-content .token.punctuation {
                color: #FFFFFF;
              }
              .raw-log-content .token.timestamp {
                color: #00FFFF;
              }
            `}
          </style>
          <pre className="p-4 max-h-[400px] overflow-auto custom-scrollbar">
            <code ref={codeRef} className="language-json whitespace-pre-wrap break-words raw-log-content">
              {formattedJson}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TimelineRawLog;