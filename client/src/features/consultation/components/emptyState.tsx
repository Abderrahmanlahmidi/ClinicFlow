import React from 'react';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { EMPTY_STATE_MESSAGES } from '../constants';

interface EmptyStateProps {
  isDoctor: boolean;
  onAddConsultation: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isDoctor, onAddConsultation }) => {
  const messages = isDoctor ? EMPTY_STATE_MESSAGES.doctor : EMPTY_STATE_MESSAGES.patient;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
      <FiFileText className="w-20 h-20 mx-auto mb-6 text-gray-500" />
      <p className="text-xl font-medium text-gray-400 mb-3">
        {messages.title}
      </p>
      <p className="text-gray-500 max-w-md mx-auto">
        {messages.description}
      </p>
      {isDoctor && (
        <button
          onClick={onAddConsultation}
          className="px-6 py-3 bg-gray-900 border border-lime-400 text-lime-400 rounded-lg hover:bg-lime-400/10 transition-colors flex items-center gap-2 mx-auto mt-6"
        >
          <FiPlus className="w-5 h-5" />
          {messages.buttonText}
        </button>
      )}
    </div>
  );
};