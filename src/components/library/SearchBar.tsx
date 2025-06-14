
import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="w-full mb-4 flex items-center" data-testid="search-bar-container">
      <Search className="text-gray-400 mr-3 min-w-[22px]" size={22} data-testid="search-bar-icon"/>
      <input
        type="text"
        className="block w-full rounded-md border border-input bg-background py-2 pl-3 pr-4 text-base md:text-sm"
        placeholder="Search by title, author, or year..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="search-bar"
      />
    </div>
  );
};
