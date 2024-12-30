import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";
import { Alert } from "./types";

interface TimelineRawLogProps {
  alert: Alert;
}

const TimelineRawLog = ({ alert }: TimelineRawLogProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isExpanded && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [isExpanded, alert.raw_log]);

  const onToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
      >
        <Terminal className="h-4 w-4" />
        Raw Log
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && alert.raw_log && (
        <div className="mt-2 bg-[#1E1E1E] rounded-lg border border-blue-500/10 transition-all overflow-hidden">
          <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
            <code ref={codeRef} className="language-json">
              {JSON.stringify(JSON.parse(alert.raw_log), null, 2)}
            </code>
          </pre>
        </div>
      )}
    </>
  );
};

export default TimelineRawLog;