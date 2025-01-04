import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import { Alert } from "./types";

interface TimelineRawLogProps {
  alert: Alert;
}

const TimelineRawLog = ({ alert }: TimelineRawLogProps) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [alert.raw]);

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
    <div className="w-full h-full">
      <div className="flex items-center gap-2 mb-2 text-purple-400">
        <Terminal className="h-4 w-4" />
        Raw Log
      </div>
      <div className="bg-[#1A1F2C]/80 backdrop-blur-sm rounded-lg border border-purple-500/20 transition-all duration-200 hover:border-purple-500/30">
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
              color: #E5DEFF;
            }
            .raw-log-content .token.property {
              color: #9b87f5;
            }
            .raw-log-content .token.string {
              color: #7E69AB;
            }
            .raw-log-content .token.number {
              color: #D946EF;
            }
            .raw-log-content .token.boolean {
              color: #8B5CF6;
            }
            .raw-log-content .token.null {
              color: #6E59A5;
            }
            .raw-log-content .token.punctuation {
              color: #6E59A5;
            }
          `}
        </style>
        <pre className="p-4 h-full overflow-auto custom-scrollbar">
          <code ref={codeRef} className="language-json whitespace-pre-wrap break-words raw-log-content">
            {formattedJson}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default TimelineRawLog;