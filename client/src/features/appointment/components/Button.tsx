import React from "react";
import { FiCalendar, FiLoader } from "react-icons/fi";

interface SubmitButtonProps {
  isLoading: boolean;
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isSubmitting }) => {
  const loading = isLoading || isSubmitting;

  return (
    <div className="pt-4 border-t border-gray-700">
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-lime-400 text-gray-900 rounded-lg font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" />
            Creating Appointment...
          </>
        ) : (
          <>
            <FiCalendar className="w-5 h-5" />
            Create Appointment
          </>
        )}
      </button>
    </div>
  );
};

export default SubmitButton;