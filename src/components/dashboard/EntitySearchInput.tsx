import React from "react";
import { Search } from "lucide-react";

interface EntitySearchInputProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const EntitySearchInput = ({ searchQuery, onSearchChange }: EntitySearchInputProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400/50" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search entities..."
        className={`
          w-full pl-10 pr-4 py-2.5
          bg-[#1e2c3d]/40 hover:bg-[#1e2c3d]/60
          border border-blue-500/5 hover:border-blue-500/10
          rounded-lg
          text-sm text-blue-100/90
          placeholder:text-blue-400/50
          transition-colors duration-200
          focus:outline-none focus:ring-1 focus:ring-blue-500/20
        `}
      />
    </div>
  );
};

export default EntitySearchInput;