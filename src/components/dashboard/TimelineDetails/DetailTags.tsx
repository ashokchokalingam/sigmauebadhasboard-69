import { Tag } from "lucide-react";

interface DetailTagsProps {
  tags: string;
}

const DetailTags = ({ tags }: DetailTagsProps) => (
  <div className="bg-purple-400/5 rounded-lg p-6 border border-purple-400/20">
    <h3 className="text-sm font-medium text-purple-200 mb-4 flex items-center gap-2">
      <Tag className="h-4 w-4" /> Tags
    </h3>
    <div className="flex flex-wrap gap-2">
      {tags?.split(',').map((tag, index) => (
        <span 
          key={index}
          className="px-3 py-1.5 bg-purple-500/10 text-purple-300 text-sm rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
        >
          {tag.trim()}
        </span>
      ))}
    </div>
  </div>
);

export default DetailTags;