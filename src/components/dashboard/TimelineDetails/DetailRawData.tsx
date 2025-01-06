import { useState, useEffect, useRef } from 'react';
import { Database, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

interface DetailRawDataProps {
  raw: any;
}

const DetailRawData = ({ raw }: DetailRawDataProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && isExpanded) {
      Prism.highlightElement(codeRef.current);
    }
  }, [raw, isExpanded]);

  const formattedJson = typeof raw === 'string' 
    ? JSON.stringify(JSON.parse(raw), null, 2)
    : JSON.stringify(raw, null, 2);

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
        <Database className="h-4 w-4" />
        <span className="font-medium">Raw Data</span>
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[500px]" : "max-h-0"
      )}>
        <pre className="p-6 overflow-auto custom-scrollbar">
          <code ref={codeRef} className="language-json text-sm">
            {formattedJson}
          </code>
        </pre>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default DetailRawData;