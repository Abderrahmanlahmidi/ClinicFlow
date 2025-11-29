import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface CreateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  loadingText?: string;
  normalText?: string;
  className?: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({
  onClick,
  isLoading,
  loadingText = "Creating...",
  normalText = "Create New",
  className = ""
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${className}`}
    >
      <FiPlus className="w-5 h-5" />
      {isLoading ? loadingText : normalText}
    </button>
  );
};

export default CreateButton;