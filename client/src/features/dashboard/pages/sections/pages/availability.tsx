import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiSearch,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import CreateAvailabilityForm from "../../components/CreateAvailabilityForm";
import UpdateAvailabilityForm from "../../components/UpdateAvailabilityForm";
import { HandleSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import {
  getAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../apis/availabilityApi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import ConfirmationModal from "../../components/confirmationModal";

const Availability = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
  const [availabilityUsers, setAvailabilityUsers] = useState([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use form hook for modal management
  const {
    selectedUser: selectedAvailability,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms, 
    setSelectedUser: setSelectedAvailability,
  } = useHandleForm();

  // Get availabilities data
  const { data: availabilities, isLoading: isLoadingAvailabilities } = useQuery(
    {
      queryKey: ["availabilities"],
      queryFn: getAvailabilities,
    }
  );

  // Search hook
  const filteredData = HandleSearch(availabilities?.availabilities, searchTerm);

  // Create availability mutation
  const createAvailabilityMutation = useMutation({
    mutationFn: createAvailability,
    onSuccess: () => {
      toast.success("Availability created successfully!");
      queryClient.invalidateQueries(["availabilities"]);
      handleCloseForms();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create availability"
      );
    },
  });

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      toast.success("Availability updated successfully!");
      queryClient.invalidateQueries(["availabilities"]);
      handleCloseForms();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    },
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      toast.success("Availability deleted successfully!");
      queryClient.invalidateQueries(["availabilities"]);
      setDeleteModalOpen(false);
      setAvailabilityToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete availability"
      );
    },
  });

  const handleCreateAvailability = async (availabilityData) => {
    createAvailabilityMutation.mutate(availabilityData);
  };

  const handleUpdateAvailability = async (availabilityData) => {
    if (selectedAvailability) {
      updateAvailabilityMutation.mutate({
        id: selectedAvailability._id,
        data: availabilityData,
      });
    }
  };

  const handleDeleteClick = (availability) => {
    setAvailabilityToDelete(availability);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (availabilityToDelete) {
      deleteAvailabilityMutation.mutate(availabilityToDelete._id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAvailabilityToDelete(null);
  };

  const formatDayOfWeek = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getUserName = (availability) => {
    if (availability.userId?.firstName) {
      return `${availability.userId.firstName} ${availability.userId.lastName}`;
    }
    return "Unknown User";
  };

  useEffect(() => {
    if (!availabilities || availabilities.length === 0) return;

    const getUsersFromAvailabilities = () => {
      const users = availabilities.availabilities.map((item) => item.userId);

      const uniqueUsers = users.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      );

      setAvailabilityUsers(uniqueUsers);
    };

    getUsersFromAvailabilities();
  }, [availabilities]);




  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2 flex items-center gap-3">
              <FiCalendar className="w-8 h-8 text-lime-400" />
              Availability Management
            </h1>
            <p className="text-gray-300">
              Manage user schedules and daily capacities
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            disabled={createAvailabilityMutation.isLoading}
            className="bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium mt-4 sm:mt-0 hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus className="w-5 h-5" />
            {createAvailabilityMutation.isLoading
              ? "Creating..."
              : "Add Availability"}
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by user name, day of week..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Availabilities Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Day
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Time Slot
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Daily Capacity
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {filteredData?.length > 0 ? (
                    filteredData?.map((availability) => (
                      <tr
                        key={availability._id}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600 overflow-hidden">
                              {availability.userId?.imageProfile ? (
                                <img
                                  src={`http://localhost:8000${availability.userId.imageProfile}`}
                                  alt={`${getUserName(availability)}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-full h-full flex items-center justify-center ${
                                  availability.userId?.imageProfile
                                    ? "hidden"
                                    : "flex"
                                }`}
                              >
                                <FiUsers className="w-5 h-5 text-lime-400" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {getUserName(availability)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {availability.userId?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiCalendar className="w-4 h-4 text-lime-400" />
                            {formatDayOfWeek(availability.dayOfWeek)}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiClock className="w-4 h-4 text-lime-400" />
                            {availability.startTime} - {availability.endTime}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-lime-400/20">
                              <span className="text-lime-400 text-sm font-medium">
                                {availability.dailyCapacity}
                              </span>
                            </div>
                            <span className="text-gray-300">appointments</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(availability)}
                              disabled={updateAvailabilityMutation.isLoading}
                              className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                              title="Edit availability"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(availability)}
                              disabled={deleteAvailabilityMutation.isLoading}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Delete availability"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 px-6 text-center">
                        <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No availabilities found
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "Get started by adding your first availability"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Forms */}
        {showCreateForm && (
          <CreateAvailabilityForm
            onClose={handleCloseForms}
            onSubmit={handleCreateAvailability}
            isLoading={createAvailabilityMutation.isLoading}
            users={availabilityUsers}
            availabilities={availabilities?.availabilities || []}
          />
        )}

        {showUpdateForm && (
          <UpdateAvailabilityForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateAvailability}
            isLoading={updateAvailabilityMutation.isLoading}
            availability={selectedAvailability}
            users={availabilityUsers}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Availability"
          message={`Are you sure you want to delete the availability `}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteAvailabilityMutation.isLoading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default Availability;
