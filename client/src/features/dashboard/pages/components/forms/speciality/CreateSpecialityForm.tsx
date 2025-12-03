import React from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

const CreateSpecialityForm = ({ onClose, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error creating speciality:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-light text-white">
            Create New Speciality
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speciality Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Speciality name is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter speciality name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.description ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter speciality description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-lime-400 text-gray-900 rounded-lg hover:bg-lime-300 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Speciality"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSpecialityForm;
