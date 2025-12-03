import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Availability } from "../types/types.ts";
import { formatTimeDisplay } from "../utils/utils.ts";

interface AvailabilityCardProps {
  availability: Availability;
  onEdit: (availability: Availability) => void;
  onDelete: (id: string) => void;
}

export const AvailabilityCard: React.FC<AvailabilityCardProps> = ({
  availability,
  onEdit,
  onDelete,
}) => {
  const startTimeValue =
    typeof availability.startTime === "string"
      ? availability.startTime
      : availability.startTime?.value || "";
  const endTimeValue =
    typeof availability.endTime === "string"
      ? availability.endTime
      : availability.endTime?.value || "";

  return (
    <div className="p-4 rounded-lg border border-lime-400/30 bg-lime-400/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-lime-400" />
          <div>
            <p className="text-sm font-medium text-white">
              {formatTimeDisplay(startTimeValue)} -{" "}
              {formatTimeDisplay(endTimeValue)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(availability)}
            className="p-1.5 text-gray-400 hover:text-lime-400 transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(availability._id)}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="text-center p-2 bg-gray-900 border border-gray-800 rounded">
          <p className="text-xs text-gray-400">Daily Capacity</p>
          <p className="text-sm font-medium text-white">
            {availability.dailyCapacity || "10"}
          </p>
        </div>
      </div>
    </div>
  );
};
