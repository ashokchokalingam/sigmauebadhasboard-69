
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-transform duration-300
        ${isFocused ? 'scale-90 text-[#9b87f5]' : 'text-[#9b87f5]/60'}`}>
        <Search className="h-4 w-4" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-[38px] pl-9 pr-8
          bg-[#0A0B0F] hover:bg-[#12131A]
          border border-[#5856D6]/30 focus:border-[#5856D6]/50 
          rounded-lg text-sm text-[#D6BCFA] 
          placeholder:text-[#9b87f5]/50
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-[#5856D6]/30
          focus:shadow-[0_0_10px_rgba(88,86,214,0.1)]"
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2
            text-[#9b87f5]/60 hover:text-[#9b87f5]
            transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
