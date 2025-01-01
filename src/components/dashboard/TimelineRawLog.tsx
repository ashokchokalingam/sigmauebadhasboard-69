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
      <div className="bg-[#1a1f2c] rounded-lg border border-purple-500/10 h-[calc(100%-2rem)]">
        <pre className="p-4 h-full overflow-auto">
          <code ref={codeRef} className="language-json whitespace-pre-wrap break-words">
            {formattedJson}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default TimelineRawLog;