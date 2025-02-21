
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
    const parseAndFormat = (data: any) => {
      if (typeof data === 'string') {
        try {
          return JSON.stringify(JSON.parse(data), null, 2);
        } catch {
          return data;
        }
      }
      return JSON.stringify(data, null, 2);
    };
    
    formattedJson = parseAndFormat(alert.raw);
  } catch (e) {
    formattedJson = typeof alert.raw === 'string' ? alert.raw : JSON.stringify(alert.raw);
  }

  return (
    <div className="w-full">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-4 text-purple-400 hover:text-purple-300 transition-colors bg-black/20 rounded-t-lg"
      >
        <ChevronRight className={cn(
          "h-5 w-5 transition-transform duration-200",
          isExpanded && "transform rotate-90"
        )} />
        <Terminal className="h-5 w-5" />
        <span className="font-mono text-base font-medium">Raw Log Data</span>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[800px]" : "max-h-0"
      )}>
        <div className="bg-[#1A1F2C] rounded-b-lg border border-purple-500/20 transition-all duration-200 hover:border-purple-500/30 mx-4 mb-4">
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 10px;
                height: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(139, 92, 246, 0.1);
                border-radius: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(139, 92, 246, 0.3);
                border-radius: 6px;
                border: 2px solid rgba(139, 92, 246, 0.1);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(139, 92, 246, 0.4);
              }
              .raw-log-content {
                color: #E2E8F0;
                font-size: 1rem !important;
                line-height: 1.6 !important;
                font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace !important;
              }
              .raw-log-content .token.property {
                color: #93C5FD;
              }
              .raw-log-content .token.string {
                color: #86EFAC;
              }
              .raw-log-content .token.number {
                color: #FDA4AF;
              }
              .raw-log-content .token.boolean {
                color: #93C5FD;
              }
              .raw-log-content .token.null {
                color: #F9A8D4;
              }
              .raw-log-content .token.punctuation {
                color: #94A3B8;
              }
            `}
          </style>
          <div className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-sm">
            <pre className="p-8 max-h-[600px] overflow-auto custom-scrollbar">
              <code ref={codeRef} className="language-json raw-log-content">
                {formattedJson}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineRawLog;
