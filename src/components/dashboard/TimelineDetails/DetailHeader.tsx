import { X } from "lucide-react";

interface DetailHeaderProps {
  title: string;
  onClose: () => void;
}

const DetailHeader = ({ title, onClose }: DetailHeaderProps) => (
  <div className="flex justify-between items-center sticky top-0 z-30 bg-gradient-to-r from-[#1E1E2F] to-[#1A1F2C] py-6 px-8 border-b border-purple-400/10">
    <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
      {title || 'N/A'}
    </h2>
    <button 
      onClick={onClose}
      className="text-purple-300 hover:text-purple-100 transition-colors p-2 hover:bg-purple-400/10 rounded-full"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

export default DetailHeader;