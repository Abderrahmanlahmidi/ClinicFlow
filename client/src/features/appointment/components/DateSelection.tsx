import React from "react";
import { FiCalendar, FiLoader } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface DateSelectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isLoadingAvailability: boolean;
  isSubmitting: boolean;
  availableDays: string[];
}

const DateSelection: React.FC<DateSelectionProps> = ({
  register,
  errors,
  isLoadingAvailability,
  isSubmitting,
  availableDays,
}) => {
  if (availableDays.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4" />
          Select Date *
        </div>
      </label>

      <input
        type="date"
        {...register("date", {
          required: "Date is required",
          validate: {
            futureDate: (value) => {
              if (!value) return "Date is required";
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || "Date must be today or in the future";
            },
          },
        })}
        disabled={isLoadingAvailability || isSubmitting}
        min={new Date().toISOString().split("T")[0]}
        className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
          errors.date ? "border-red-500" : "border-gray-600"
        } ${isLoadingAvailability || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
      />

      {errors.date && (
        <p className="mt-1 text-sm text-red-400">
          {errors.date.message as string}
        </p>
      )}
      
      {isLoadingAvailability && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
          <FiLoader className="w-3 h-3 animate-spin" />
          Loading availability...
        </div>
      )}
    </div>
  );
};

export default DateSelection;