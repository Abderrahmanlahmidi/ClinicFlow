import React from "react";
import { FiUser } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { User } from "../types";

interface PatientSelectionProps {
  isDoctor: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isLoadingPatients: boolean;
  patientsError: Error | null;
  patientsList: User[];
  isSubmitting: boolean;
}

const PatientSelection: React.FC<PatientSelectionProps> = ({
  isDoctor,
  register,
  errors,
  isLoadingPatients,
  patientsError,
  patientsList,
  isSubmitting,
}) => {
  if (!isDoctor) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <FiUser className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <p className="text-white font-medium">Your appointment</p>
            <p className="text-sm text-gray-400">You are the patient</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          Select Patient *
        </div>
      </label>

      <select
        {...register("patientId", { required: "Patient is required" })}
        disabled={isLoadingPatients || isSubmitting}
        className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
          errors.patientId ? "border-red-500" : "border-gray-600"
        } ${isLoadingPatients || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="">Select patient...</option>
        {patientsList.map((p) => (
          <option key={p._id} value={p._id}>
            {p.firstName} {p.lastName}
          </option>
        ))}
      </select>

      {errors.patientId && (
        <p className="mt-1 text-sm text-red-400">
          {errors.patientId.message as string}
        </p>
      )}
      
      {isLoadingPatients && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <div className="w-3 h-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          Loading patients...
        </div>
      )}
      
      {patientsError && (
        <p className="mt-2 text-sm text-red-400">Failed to load patients</p>
      )}
    </div>
  );
};

export default PatientSelection;