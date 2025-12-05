import React from 'react';
import { FiClock } from 'react-icons/fi';

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FiClock className="w-8 h-8 text-lime-400 animate-spin" />
        <p className="text-gray-300">Loading consultations...</p>
      </div>
    </div>
  );
};