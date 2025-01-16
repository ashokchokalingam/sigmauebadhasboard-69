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
        <Terminal className="h-5 w-5" />
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
    <div className="bg-purple-400/5 rounded-lg border border-purple-400/20 transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-4 text-purple-200 hover:bg-purple-400/10 transition-colors rounded-lg"
      >
        <ChevronRight className={cn(
          "h-5 w-5 transition-transform duration-300",
          isExpanded && "transform rotate-90"
        )} />
        <Terminal className="h-5 w-5" />
        <span className="text-sm font-medium">Raw Data</span>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pb-4">
          <div className="bg-[#1A1F2C] rounded-lg border border-purple-500/20 overflow-hidden">
            <pre className="p-4 text-sm overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-purple-400/20 scrollbar-track-transparent">
              <code ref={codeRef} className="language-json raw-log-content">
                {formattedJson}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <style jsx global>{`
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