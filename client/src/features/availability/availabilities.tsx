import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiAlertCircle,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteAvailability,
  updateAvailability,
  createAvailability,
  getDoctorAvailabilities,
} from "../dashboard/pages/services/availabilityApi";
import { DAYS_OF_WEEK } from "../dashboard/pages/constants/availability";
import { useToast } from "../../ui/toasts/toast";
import { useForm } from "react-hook-form";
import ConfirmationModal from "../dashboard/pages/components/others/ConfirmationModal";
import { AvailabilityForm } from "./components/AvailabilityForm.tsx";
import { AvailabilityCard } from "./components/AvailabilityCard.tsx";
import type { Availability, AvailabilityFormData } from "./types/types.ts";
import { DEFAULT_AVAILABILITY_FORM_VALUES } from "./constants/constants.ts";
import { extractStringValue, getUniqueDays } from "./utils/utils.ts";

export default function Availabilities() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<Availability | null>(null);
  const [availabilityToDelete, setAvailabilityToDelete] =
    useState<Availability | null>(null);
  const [processedAvailabilities, setProcessedAvailabilities] = useState<
    Availability[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AvailabilityFormData>({
    defaultValues: DEFAULT_AVAILABILITY_FORM_VALUES,
  });

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Fetch doctor availabilities
  const {
    data: availabilitiesResponse,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["availabilities", userId],
    queryFn: () => getDoctorAvailabilities(userId || ""),
    enabled: !!userId && role?.toLowerCase() === "doctor",
  });

  // Process availabilities when data changes
  useEffect(() => {
    if (availabilitiesResponse) {
      let availabilitiesArray: Availability[] = [];

      // Try different response formats
      if (Array.isArray(availabilitiesResponse)) {
        availabilitiesArray = availabilitiesResponse;
      } else if (availabilitiesResponse?.userAvailabilities) {
        availabilitiesArray = availabilitiesResponse.userAvailabilities;
      } else if (availabilitiesResponse?.availabilities) {
        availabilitiesArray = availabilitiesResponse.availabilities;
      } else if (availabilitiesResponse?.data) {
        availabilitiesArray = Array.isArray(availabilitiesResponse.data)
          ? availabilitiesResponse.data
          : [availabilitiesResponse.data];
      }

      console.log("Processed availabilities:", availabilitiesArray);
      setProcessedAvailabilities(availabilitiesArray);
    }
  }, [availabilitiesResponse]);

  // Create availability mutation
  const createMutation = useMutation({
    mutationFn: (data: AvailabilityFormData) =>
      createAvailability({
        userId,
        ...data,
        dailyCapacity: Number(data.dailyCapacity),
      }),
    onSuccess: () => {
      toast.success("Availability created successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      closeForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create availability"
      );
    },
  });

  // Update availability mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AvailabilityFormData }) =>
      updateAvailability({
        _id: id,
        ...data,
        dailyCapacity: Number(data.dailyCapacity),
      }),
    onSuccess: () => {
      toast.success("Availability updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      closeForm();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    },
  });

  // Delete availability mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      toast.success("Availability deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      setAvailabilityToDelete(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete availability"
      );
    },
  });

  const onSubmit = (data: AvailabilityFormData) => {
    if (editingAvailability) {
      updateMutation.mutate({ id: editingAvailability._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: string) => {
    const availability = processedAvailabilities.find((a) => a._id === id);
    if (availability) {
      setAvailabilityToDelete(availability);
    }
  };

  const confirmDelete = () => {
    if (availabilityToDelete) {
      deleteMutation.mutate(availabilityToDelete._id);
    }
  };

  const handleEdit = (availability: Availability) => {
    setEditingAvailability(availability);
    reset({
      dayOfWeek:
        extractStringValue(availability.dayOfWeek) ||
        DEFAULT_AVAILABILITY_FORM_VALUES.dayOfWeek,
      startTime:
        extractStringValue(availability.startTime) ||
        DEFAULT_AVAILABILITY_FORM_VALUES.startTime,
      endTime:
        extractStringValue(availability.endTime) ||
        DEFAULT_AVAILABILITY_FORM_VALUES.endTime,
      dailyCapacity:
        availability.dailyCapacity ||
        DEFAULT_AVAILABILITY_FORM_VALUES.dailyCapacity,
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAvailability(null);
    reset(DEFAULT_AVAILABILITY_FORM_VALUES);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAvailability(null);
    reset();
  };

  const uniqueDays = getUniqueDays(processedAvailabilities);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiRefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-gray-300">Loading availabilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">
              Error Loading Availabilities
            </h2>
          </div>
          <p className="text-gray-300 mb-4">
            {error.message || "Failed to load availabilities"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-white mb-2 flex items-center gap-3">
                <FiCalendar className="w-7 h-7 text-lime-400" />
                My Availabilities
              </h1>
              <p className="text-gray-400">
                Manage your weekly schedule and appointment slots
              </p>
            </div>

            <button
              onClick={handleAddNew}
              className="px-4 py-2.5 bg-gray-900 border border-lime-400 text-lime-400 rounded-lg hover:bg-lime-400/10 transition-colors flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Availability
            </button>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Days</p>
                <p className="text-2xl font-semibold text-white">
                  {uniqueDays.length}
                </p>
              </div>
              <FiCalendar className="w-8 h-8 text-lime-400" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Slots</p>
                <p className="text-2xl font-semibold text-white">
                  {processedAvailabilities.length}
                </p>
              </div>
              <FiClock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Capacity</p>
                <p className="text-2xl font-semibold text-white">
                  {processedAvailabilities.reduce(
                    (sum, a) => sum + (a.dailyCapacity || 0),
                    0
                  )}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Availabilities Grid */}
        {!Array.isArray(processedAvailabilities) ||
        processedAvailabilities.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <FiCalendar className="w-20 h-20 mx-auto mb-6 text-gray-500" />
            <p className="text-xl font-medium text-gray-400 mb-3">
              No availabilities set
            </p>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              You haven't set any availability slots yet. Click the button above
              to add your first availability.
            </p>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-gray-900 border border-lime-400 text-lime-400 rounded-lg hover:bg-lime-400/10 transition-colors flex items-center gap-2 mx-auto"
            >
              <FiPlus className="w-5 h-5" />
              Add Your First Availability
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DAYS_OF_WEEK.map((dayObj) => {
              const dayValue =
                typeof dayObj === "string" ? dayObj : dayObj.value;
              const dayLabel =
                typeof dayObj === "string" ? dayObj : dayObj.label;
              const dayAvailabilities = processedAvailabilities.filter(
                (a) => extractStringValue(a.dayOfWeek) === dayValue
              );

              return (
                <motion.div
                  key={dayValue}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FiCalendar className="w-5 h-5 text-lime-400" />
                        {dayLabel}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          dayAvailabilities.length > 0
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}
                      >
                        {dayAvailabilities.length} slots
                      </span>
                    </div>

                    {dayAvailabilities.length === 0 ? (
                      <div className="text-center py-8">
                        <FiClock className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                        <p className="text-gray-400">No availability set</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dayAvailabilities.map((availability) => (
                          <AvailabilityCard
                            key={availability._id}
                            availability={availability}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Overlay Form */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl"
            >
              <AvailabilityForm
                onSubmit={onSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                isEditing={!!editingAvailability}
                register={register}
                handleSubmit={handleSubmit}
                formState={{ errors }}
                reset={reset}
                onClose={closeForm}
              />
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!availabilityToDelete}
          onClose={() => setAvailabilityToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Availability"
          message={`Are you sure you want to delete this availability for ${availabilityToDelete ? extractStringValue(availabilityToDelete.dayOfWeek) : "this day"}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isPending}
          variant="danger"
        />
      </div>
    </div>
  );
}
