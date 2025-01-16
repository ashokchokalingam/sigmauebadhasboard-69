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
      <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 flex items-center gap-2 text-purple-200">
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
    <div className="bg-purple-400/5 rounded-lg border border-purple-400/20">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-4 text-purple-200 hover:text-purple-100 transition-colors"
      >
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform duration-200",
          isExpanded && "transform rotate-90"
        )} />
        <Terminal className="h-4 w-4" />
        <span className="text-sm font-medium">Raw Data</span>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[600px]" : "max-h-0"
      )}>
        <div className="px-4 pb-4">
          <div className="bg-[#1A1F2C] rounded-lg border border-purple-500/20 overflow-hidden">
            <pre className="p-4 text-sm overflow-auto max-h-[500px] custom-scrollbar">
              <code ref={codeRef} className="language-json raw-log-content">
                {formattedJson}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
          font-family: 'JetBrains Mono', monospace !important;
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
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
      `}</style>
    </div>
  );
};

export default TimelineRawLog;