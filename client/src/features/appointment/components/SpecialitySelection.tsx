import React from "react";
import { FiBriefcase, FiLoader } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { Speciality } from "../types";

interface SpecialitySelectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isLoadingSpecialities: boolean;
  specialitiesError: Error | null;
  specialities: Speciality[];
  isSubmitting: boolean;
}

const SpecialitySelection: React.FC<SpecialitySelectionProps> = ({
  register,
  errors,
  isLoadingSpecialities,
  specialitiesError,
  specialities,
  isSubmitting,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <FiBriefcase className="w-4 h-4" />
          Select Speciality *
        </div>
      </label>

      <select
        {...register("specialityId", { required: "Speciality is required" })}
        disabled={isLoadingSpecialities || isSubmitting}
        className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
          errors.specialityId ? "border-red-500" : "border-gray-600"
        } ${isLoadingSpecialities || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="">Select speciality...</option>
        {specialities.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      {errors.specialityId && (
        <p className="mt-1 text-sm text-red-400">
          {errors.specialityId.message as string}
        </p>
      )}
      
      {isLoadingSpecialities && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <FiLoader className="w-3 h-3 animate-spin" />
          Loading specialities...
        </div>
      )}
      
      {specialitiesError && (
        <p className="mt-2 text-sm text-red-400">Failed to load specialities</p>
      )}
    </div>
  );
};

export default SpecialitySelection;