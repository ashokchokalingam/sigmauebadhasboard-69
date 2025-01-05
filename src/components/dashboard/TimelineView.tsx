import React from "react";
import TimelineHeader from "./TimelineComponents/TimelineHeader";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TimelineViewProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose: () => void;
  inSidebar?: boolean;
}

const TimelineView = ({ entityType, entityId, onClose, inSidebar = false }: TimelineViewProps) => {
  const content = (
    <>
      <TimelineHeader 
        entityType={entityType} 
        entityId={entityId} 
        onClose={onClose} 
        inSidebar={inSidebar} 
      />
      
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <p>Timeline view is temporarily unavailable during system optimization. Please check back later.</p>
      </Alert>
    </>
  );

  if (inSidebar) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] overflow-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        {content}
      </div>
    </div>
  );
};

export default TimelineView;