import { FiX, FiSave, FiRefreshCw } from "react-icons/fi";
import type {
  UseFormRegister,
  FieldErrors,
  SubmitHandler,
} from "react-hook-form";
import {
  DAYS_OF_WEEK,
  TIME_SLOTS,
} from "../../dashboard/pages/constants/availability.tsx";
import { FORM_LABELS, FORM_MESSAGES, CAPACITY_CONSTRAINTS } from "../constants/constants.ts";
import { formatTimeDisplay } from "../utils/utils.ts";
import type { AvailabilityFormData } from "../types/types.ts";

interface AvailabilityFormProps {
  onSubmit: (data: AvailabilityFormData) => void;
  isLoading: boolean;
  isEditing: boolean;
  register: UseFormRegister<AvailabilityFormData>;
  handleSubmit: (
    callback: SubmitHandler<AvailabilityFormData>
  ) => (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
  errors?: FieldErrors<AvailabilityFormData>;
  onClose: () => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSubmit,
  isLoading,
  isEditing,
  register,
  handleSubmit,
  errors = {},
  onClose,
}) => {


  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            {isEditing ? "Edit Availability" : "Add New Availability"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Day of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {FORM_LABELS.dayOfWeek}
            </label>
            <select
              {...register("dayOfWeek", {
                required: FORM_MESSAGES.dayOfWeekRequired,
              })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            >
              {DAYS_OF_WEEK.map((dayObj: any) => {
                const dayValue =
                  typeof dayObj === "string" ? dayObj : dayObj.value;
                const dayLabel =
                  typeof dayObj === "string" ? dayObj : dayObj.label;
                return (
                  <option key={dayValue} value={dayValue}>
                    {dayLabel}
                  </option>
                );
              })}
            </select>
            {errors.dayOfWeek && (
              <p className="mt-1 text-sm text-red-400">
                {errors.dayOfWeek.message}
              </p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {FORM_LABELS.startTime}
              </label>
              <select
                {...register("startTime", {
                  required: FORM_MESSAGES.startTimeRequired,
                })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
              >
                {TIME_SLOTS.map((time: string) => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
                  </option>
                ))}
              </select>
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {FORM_LABELS.endTime}
              </label>
              <select
                {...register("endTime", {
                  required: FORM_MESSAGES.endTimeRequired,
                })}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
              >
                {TIME_SLOTS.map((time: string) => (
                  <option key={time} value={time}>
                    {formatTimeDisplay(time)}
                  </option>
                ))}
              </select>
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Daily Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {FORM_LABELS.dailyCapacity}
            </label>
            <input
              type="number"
              min={CAPACITY_CONSTRAINTS.min}
              max={CAPACITY_CONSTRAINTS.max}
              {...register("dailyCapacity", {
                required: FORM_MESSAGES.dailyCapacityRequired,
                min: {
                  value: CAPACITY_CONSTRAINTS.min,
                  message: FORM_MESSAGES.capacityMin,
                },
                max: {
                  value: CAPACITY_CONSTRAINTS.max,
                  message: FORM_MESSAGES.capacityMax,
                },
              })}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
            />
            {errors.dailyCapacity && (
              <p className="mt-1 text-sm text-red-400">
                {errors.dailyCapacity.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-lime-400 text-gray-900 font-medium rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                {isEditing ? "Update Availability" : "Create Availability"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
