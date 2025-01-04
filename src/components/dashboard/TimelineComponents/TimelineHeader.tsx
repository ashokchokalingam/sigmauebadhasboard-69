import { Monitor, User, X } from "lucide-react";

interface TimelineHeaderProps {
  entityType: "user" | "computer";
  entityId: string;
  onClose?: () => void;
  inSidebar?: boolean;
}

const TimelineHeader = ({ entityType, entityId, onClose, inSidebar }: TimelineHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        {entityType === "user" ? (
          <User className="h-6 w-6 text-purple-500" />
        ) : (
          <Monitor className="h-6 w-6 text-purple-500" />
        )}
        <h1 className="text-xl font-bold text-purple-100">
          {entityId} Timeline
        </h1>
      </div>
      {!inSidebar && onClose && (
        <button 
          onClick={onClose}
          className="p-2 hover:bg-purple-500/10 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-purple-400" />
        </button>
      )}
    </div>
  );
};

export default TimelineHeader;