import React from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

interface PharmacyType {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  prescriptionsIds: string[];
}

interface UpdatePharmacyFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<PharmacyFormData>) => void;
  pharmacy: PharmacyType | null;
  isLoading?: boolean;
}

interface PharmacyFormData {
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  openingHours: string;
  latitude: number;
  longitude: number;
}

const UpdatePharmacyForm: React.FC<UpdatePharmacyFormProps> = ({
  onClose,
  onSubmit,
  pharmacy,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PharmacyFormData>({
    defaultValues: {
      name: pharmacy?.name || '',
      address: pharmacy?.address || '',
      phoneNumber: pharmacy?.phoneNumber || '',
      emailAddress: pharmacy?.emailAddress || '',
      openingHours: pharmacy?.openingHours || '',
      latitude: pharmacy?.latitude || 0,
      longitude: pharmacy?.longitude || 0,
    }
  });

  const onFormSubmit = async (data: PharmacyFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error updating pharmacy:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!pharmacy) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-light text-white">Update Pharmacy</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Pharmacy Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pharmacy Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Pharmacy name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter pharmacy name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <textarea
              {...register("address", {
                required: "Address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters"
                }
              })}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.address ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("emailAddress", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                  errors.emailAddress ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter email address"
              />
              {errors.emailAddress && (
                <p className="mt-1 text-sm text-red-400">{errors.emailAddress.message}</p>
              )}
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Opening Hours
            </label>
            <input
              type="text"
              {...register("openingHours", {
                required: "Opening hours are required"
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.openingHours ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="e.g., 9:00 AM - 6:00 PM, Monday to Friday"
            />
            {errors.openingHours && (
              <p className="mt-1 text-sm text-red-400">{errors.openingHours.message}</p>
            )}
          </div>

          {/* Location Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...register("latitude", {
                  required: "Latitude is required",
                  valueAsNumber: true,
                  min: {
                    value: -90,
                    message: "Latitude must be between -90 and 90"
                  },
                  max: {
                    value: 90,
                    message: "Latitude must be between -90 and 90"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                  errors.latitude ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter latitude"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-400">{errors.latitude.message}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...register("longitude", {
                  required: "Longitude is required",
                  valueAsNumber: true,
                  min: {
                    value: -180,
                    message: "Longitude must be between -180 and 180"
                  },
                  max: {
                    value: 180,
                    message: "Longitude must be between -180 and 180"
                  }
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                  errors.longitude ? "border-red-500" : "border-gray-600"
                }`}
                placeholder="Enter longitude"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-400">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
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
              {isLoading ? "Updating..." : "Update Pharmacy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePharmacyForm;