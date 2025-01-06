import { Tag } from "lucide-react";
import { Alert } from "../types";

interface DetailTagsProps {
  alert: Alert;
}

const DetailTags = ({ alert }: DetailTagsProps) => {
  return (
    <div className="bg-purple-400/5 rounded-lg p-4 border border-purple-400/20 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
        <Tag className="h-4 w-4" /> Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {alert.tags?.split(',').map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DetailTags;