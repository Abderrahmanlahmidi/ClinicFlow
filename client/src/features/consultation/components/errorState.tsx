import React from 'react';
import { FiHeart } from 'react-icons/fi';

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <FiHeart className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-semibold text-white">
            Error Loading Consultations
          </h2>
        </div>
        <p className="text-gray-300 mb-4">
          {error.message || "Failed to load consultations"}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};