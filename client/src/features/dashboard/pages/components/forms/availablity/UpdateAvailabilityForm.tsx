
import { useState, useEffect } from "react";
import { FiX, FiClock, FiUsers, FiCalendar } from "react-icons/fi";
import { DAYS_OF_WEEK, TIME_SLOTS } from "../../../constants/availability.tsx";

const UpdateAvailabilityForm = ({
  onClose,
  onSubmit,
  isLoading,
  availability,
  users,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    dailyCapacity: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (availability) {
      setFormData({
        userId: availability.userId?._id || availability.userId || "",
        dayOfWeek: availability.dayOfWeek || "",
        startTime: availability.startTime || "",
        endTime: availability.endTime || "",
        dailyCapacity: availability.dailyCapacity?.toString() || "",
      });
    }
  }, [availability]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) newErrors.userId = "User is required";
    if (!formData.dayOfWeek) newErrors.dayOfWeek = "Day of week is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.dailyCapacity)
      newErrors.dailyCapacity = "Daily capacity is required";

    if (formData.startTime && formData.endTime) {
      const startHour = parseInt(formData.startTime.split(":")[0]);
      const endHour = parseInt(formData.endTime.split(":")[0]);
      if (startHour >= endHour) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (
      formData.dailyCapacity &&
      (formData.dailyCapacity < 1 || formData.dailyCapacity > 100)
    ) {
      newErrors.dailyCapacity = "Daily capacity must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        dailyCapacity: parseInt(formData.dailyCapacity),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-700">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <FiCalendar className="w-5 h-5 text-lime-400" />
        Update Availability
      </h2>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
      >
        <FiX className="w-5 h-5" />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          User
        </label>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white ${
            errors.userId ? "border-red-500" : "border-gray-600"
          }`}
        >
          <option value="">Select User</option>
          {users?.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="text-red-400 text-sm mt-1">{errors.userId}</p>
        )}
      </div>

      {/* Day of Week */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Day of Week
        </label>
        <select
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white ${
            errors.dayOfWeek ? "border-red-500" : "border-gray-600"
          }`}
        >
          <option value="">Select Day</option>
          {DAYS_OF_WEEK.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
        {errors.dayOfWeek && (
          <p className="text-red-400 text-sm mt-1">{errors.dayOfWeek}</p>
        )}
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FiClock className="w-4 h-4" />
            Start Time
          </label>
          <select
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white ${
              errors.startTime ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select Start</option>
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.startTime && (
            <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Time
          </label>
          <select
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white ${
              errors.endTime ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select End</option>
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {errors.endTime && (
            <p className="text-red-400 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* Daily Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <FiUsers className="w-4 h-4" />
          Daily Capacity
        </label>
        <input
          type="number"
          name="dailyCapacity"
          value={formData.dailyCapacity}
          onChange={handleChange}
          min="1"
          max="100"
          placeholder="Enter daily capacity"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white ${
            errors.dailyCapacity ? "border-red-500" : "border-gray-600"
          }`}
        />
        {errors.dailyCapacity && (
          <p className="text-red-400 text-sm mt-1">
            {errors.dailyCapacity}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-lime-400 text-gray-900 rounded-lg hover:bg-lime-300 transition-colors disabled:opacity-50 font-medium"
        >
          {isLoading ? "Updating..." : "Update Availability"}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default UpdateAvailabilityForm;
