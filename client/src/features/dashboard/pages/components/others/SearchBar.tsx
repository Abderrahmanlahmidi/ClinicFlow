import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search...",
  className = ""
}) => {
  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`relative w-full sm:w-80 ${className}`}>
      {/* Search Icon */}
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      
      {/* Search Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
      />

      {/* Clear button - Only show when there's text */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          title="Clear search"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;