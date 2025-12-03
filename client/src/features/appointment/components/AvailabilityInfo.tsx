import React from "react";
import { FiUser, FiLoader } from "react-icons/fi";
import { formatDayName } from "../utils/helpers";

interface AvailabilityInfoProps {
  isDoctor: boolean;
  availableDays: string[];
  targetDoctorId: string;
  isLoadingAvailability: boolean;
}

const AvailabilityInfo: React.FC<AvailabilityInfoProps> = ({
  isDoctor,
  availableDays,
  targetDoctorId,
  isLoadingAvailability,
}) => {
  if (!targetDoctorId) return null;

  if (isLoadingAvailability) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <FiLoader className="w-4 h-4 animate-spin" />
        Loading availability...
      </div>
    );
  }

  if (availableDays.length === 0) {
    return null; // Let the parent handle the "no availability" message
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      {isDoctor ? (
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <FiUser className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <p className="text-white font-medium">Your Availability</p>
            <p className="text-sm text-gray-400">Your scheduled availability</p>
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-300 mb-2">Doctor's Available Days:</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {availableDays.map((day) => (
          <span
            key={day}
            className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
          >
            {formatDayName(day)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityInfo;