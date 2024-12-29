import { Terminal, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

interface TimelineRawLogProps {
  raw: string;
  isExpanded: boolean;
  onToggle: (event: React.MouseEvent) => void;
}

const TimelineRawLog = ({ raw, isExpanded, onToggle }: TimelineRawLogProps) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isExpanded && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [isExpanded, raw]);

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

      {isExpanded && (
        <div className="mt-2 bg-[#1E1E1E] rounded-lg border border-blue-500/10 transition-all overflow-hidden">
          <pre className="p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
            <code ref={codeRef} className="language-json">
              {JSON.stringify(JSON.parse(raw), null, 2)}
            </code>
          </pre>
        </div>
      )}
    </>
  );
};

export default TimelineRawLog;