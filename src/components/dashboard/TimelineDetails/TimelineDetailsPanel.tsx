import React from 'react';
import { Alert } from "../types";
import TimelineMetadataGrid from '../TimelineMetadataGrid';
import TimelineMitreSection from '../TimelineMitreSection';
import { ScrollArea } from "../../ui/scroll-area";

interface TimelineDetailsPanelProps {
  selectedLog: Alert;
  onClose: () => void;
}

const TimelineDetailsPanel = ({ selectedLog, onClose }: TimelineDetailsPanelProps) => {
  return (
    <ScrollArea className="h-[800px]">
      <div className="p-6 space-y-6 bg-gradient-to-b from-[#1E1E2F] to-[#1A1F2C]">
        <div className="flex justify-between items-center sticky top-0 z-30 bg-[#1E1E2F] py-4">
          <h2 className="text-xl font-semibold text-purple-100 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-200">
            {selectedLog.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-purple-100 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-400/10"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Description</h3>
            <p className="text-sm text-purple-100/90 leading-relaxed">{selectedLog.description}</p>
          </div>

          <TimelineMetadataGrid alert={selectedLog} />
          <TimelineMitreSection alert={selectedLog} />

          <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20">
            <h3 className="text-sm font-medium text-purple-200 mb-2">Raw Data</h3>
            <pre className="text-sm text-purple-100/90 bg-[#1A1F2C] p-4 rounded-md overflow-x-auto font-mono">
              {typeof selectedLog.raw === 'string' 
                ? JSON.stringify(JSON.parse(selectedLog.raw), null, 2)
                : JSON.stringify(selectedLog.raw, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default TimelineDetailsPanel;