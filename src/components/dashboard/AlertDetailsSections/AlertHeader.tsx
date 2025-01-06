import { X } from "lucide-react";

interface AlertHeaderProps {
  onClose: () => void;
}

const AlertHeader = ({ onClose }: AlertHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b border-[#7B68EE]/20 bg-[#1E1E2F] backdrop-blur-sm sticky top-0 z-10">
      <h2 className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
        Alert Details
      </h2>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-[#2B2B3B] rounded-full transition-colors"
      >
        <X className="h-5 w-5 text-[#A9A9A9]" />
      </button>
    </div>
  );
};

export default AlertHeader;