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
        className="w-full flex items-center gap-2 p-4 text-purple-400 hover:text-purple-300 transition-colors"
      >
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform duration-200",
          isExpanded && "transform rotate-90"
        )} />
        <span className="font-mono text-base">{">"}_</span>
        Raw Log
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[800px]" : "max-h-0"
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
                color: #E5E7EB;
                font-size: 1.2rem !important;
                line-height: 2 !important;
                font-family: 'Monaco', 'Consolas', monospace !important;
                letter-spacing: 0.025em !important;
              }
              .raw-log-content .token.property {
                color: #8B5CF6 !important;
                font-size: 1.2rem !important;
                font-weight: 600 !important;
                text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
              }
              .raw-log-content .token.string {
                color: #BBF7D0 !important;
                font-size: 1.2rem !important;
              }
              .raw-log-content .token.number {
                color: #F97316 !important;
                font-size: 1.2rem !important;
                font-weight: 500 !important;
              }
              .raw-log-content .token.boolean {
                color: #D946EF !important;
                font-size: 1.2rem !important;
                font-weight: 500 !important;
              }
              .raw-log-content .token.null {
                color: #F9A8D4 !important;
                font-size: 1.2rem !important;
              }
              .raw-log-content .token.punctuation {
                color: #8E9196 !important;
                font-size: 1.2rem !important;
                opacity: 0.7;
              }
              .raw-log-content .highlight-critical {
                color: #FF4500 !important;
                font-weight: 600 !important;
                text-shadow: 0 0 8px rgba(255, 69, 0, 0.3);
              }
            `}
          </style>
          <pre className="p-8 max-h-[800px] overflow-auto custom-scrollbar">
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