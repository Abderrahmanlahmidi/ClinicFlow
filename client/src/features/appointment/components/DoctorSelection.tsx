import React from "react";
import { FiUser, FiLoader } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { User } from "../types";

interface DoctorSelectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isLoadingDoctors: boolean;
  isFetchingDoctors: boolean;
  doctorsList: User[];
  isSubmitting: boolean;
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  register,
  errors,
  isLoadingDoctors,
  isFetchingDoctors,
  doctorsList,
  isSubmitting,
}) => {
  const getSpecialityName = (doctor: User): string => {
    if (typeof doctor.specialityId === "string") return "";
    return (doctor.specialityId && (doctor.specialityId as any).name) || "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          Select Doctor *
        </div>
      </label>

      <select
        {...register("doctorId", { required: "Doctor is required" })}
        disabled={isLoadingDoctors || isFetchingDoctors || isSubmitting || !doctorsList.length}
        className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
          errors.doctorId ? "border-red-500" : "border-gray-600"
        } ${isLoadingDoctors || isFetchingDoctors || isSubmitting || !doctorsList.length ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <option value="">Select doctor...</option>
        {doctorsList.map((doctor) => {
          const specName = getSpecialityName(doctor);
          return (
            <option key={doctor._id} value={doctor._id}>
              Dr. {doctor.firstName} {doctor.lastName} 
              {specName ? ` (${specName})` : ""}
            </option>
          );
        })}
      </select>

      {errors.doctorId && (
        <p className="mt-1 text-sm text-red-400">
          {errors.doctorId.message as string}
        </p>
      )}
      
      {(isLoadingDoctors || isFetchingDoctors) && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <FiLoader className="w-3 h-3 animate-spin" />
          Loading doctors...
        </div>
      )}
      
      {!isLoadingDoctors && !isFetchingDoctors && !doctorsList.length && (
        <p className="mt-2 text-sm text-yellow-400">
          No doctors available for this speciality
        </p>
      )}
    </div>
  );
};

export default DoctorSelection;