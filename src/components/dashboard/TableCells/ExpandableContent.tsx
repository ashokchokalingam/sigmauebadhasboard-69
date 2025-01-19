import React, { useState } from 'react';

interface ExpandableContentProps {
  content: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

const ExpandableContent = ({ content, maxHeight = "40px", className = "" }: ExpandableContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`transition-all duration-200 ease-in-out cursor-pointer ${className}
        ${isExpanded ? 'whitespace-normal line-clamp-none' : 'whitespace-nowrap line-clamp-1'}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ maxHeight: isExpanded ? '200px' : maxHeight }}
    >
      {content}
    </div>
  );
};

export default ExpandableContent;