import React from "react";
import { FiCheck } from "react-icons/fi";

interface InfoBoxProps {
  isDoctor: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({ isDoctor }) => {
  return (
    <div className="mt-6 bg-gray-900 rounded-xl border border-gray-700 p-4">
      <div className="flex items-start gap-3">
        <FiCheck className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-white mb-1">
            {isDoctor ? "Doctor Guidelines" : "Appointment Booking"}
          </h3>
          <ul className="text-sm text-gray-400 space-y-1">
            {isDoctor ? (
              <>
                <li>• You can only create appointments for your own schedule</li>
                <li>• Select a patient from the list above</li>
                <li>• Choose a date from your available days</li>
              </>
            ) : (
              <>
                <li>• First select a medical speciality</li>
                <li>• Then choose a doctor from that speciality</li>
                <li>• Finally select a date from the doctor's available days</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;