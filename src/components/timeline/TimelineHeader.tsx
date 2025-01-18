import { Shield, X } from "lucide-react";

interface TimelineHeaderProps {
  entityId: string;
  onClose: () => void;
}

const TimelineHeader = ({ entityId, onClose }: TimelineHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-blue-500/10 bg-black/40">
      <div className="flex items-center gap-4">
        <Shield className="h-7 w-7 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {entityId}
          </h2>
          <p className="text-sm text-blue-300/80 mt-1">Security Timeline Analysis</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
      >
        <X className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
};

export default TimelineHeader;