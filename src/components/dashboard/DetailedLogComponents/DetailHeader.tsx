import { X } from "lucide-react";

interface DetailHeaderProps {
  title: string;
  onClose: () => void;
}

const DetailHeader = ({ title, onClose }: DetailHeaderProps) => {
  return (
    <div className="flex justify-between items-center sticky top-0 z-30 bg-[#1E1E2F]/95 backdrop-blur-sm py-4 px-6 border-b border-purple-400/20">
      <h2 className="text-xl font-semibold text-purple-100">
        {title || 'Alert Details'}
      </h2>
      <button 
        onClick={onClose}
        className="text-purple-300 hover:text-purple-100 transition-colors p-2 hover:bg-purple-400/10 rounded-full"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DetailHeader;