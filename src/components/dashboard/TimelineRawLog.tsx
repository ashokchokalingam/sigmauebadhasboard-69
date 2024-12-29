import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface TimelineRawLogProps {
  raw: string;
  isExpanded: boolean;
  onToggle: (event: React.MouseEvent) => void;
}

const TimelineRawLog = ({ raw, isExpanded, onToggle }: TimelineRawLogProps) => {
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
        <div className="bg-black/60 rounded-lg border border-blue-500/10 transition-all">
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono text-blue-100">
              {JSON.stringify(JSON.parse(raw), null, 2)}
            </code>
          </pre>
        </div>
      )}
    </>
  );
};

export default TimelineRawLog;