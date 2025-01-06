import { AlertTriangle } from "lucide-react";

interface DetailHeaderProps {
  title: string;
  onClose: () => void;
}

const DetailHeader = ({ title, onClose }: DetailHeaderProps) => {
  return (
    <div className="flex justify-between items-center sticky top-0 z-30 bg-[#1E1E2F] py-4 border-b border-purple-500/20">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-purple-100">
          {title || 'N/A'}
        </h2>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="text-purple-300 hover:text-purple-100 transition-colors rounded-full hover:bg-purple-500/10 p-2"
      >
        ×
      </button>
    </div>
  );
};

export default DetailHeader;