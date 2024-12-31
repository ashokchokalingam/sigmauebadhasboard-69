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
      <div className="p-4 text-blue-400 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        No raw log data available
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2 text-blue-400">
        <Terminal className="h-4 w-4" />
        Raw Log
      </div>
      <div className="bg-[#1E1E1E] rounded-lg border border-blue-500/10">
        <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
          <code ref={codeRef} className="language-json">
            {JSON.stringify(JSON.parse(alert.raw), null, 2)}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default TimelineRawLog;