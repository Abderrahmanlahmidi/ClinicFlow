import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import CreateAvailabilityForm from "../../components/forms/availablity/CreateAvailabilityForm.tsx";
import UpdateAvailabilityForm from "../../components/forms/availablity/UpdateAvailabilityForm.tsx";
import { useSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import {
  getAvailabilities,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../../services/availabilityApi";
import { getUsers } from "../../services/usersApi.tsx";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import ConfirmationModal from "../../components/others/ConfirmationModal.tsx";
import SearchInput from "../../components/others/SearchBar.tsx";
import CreateButton from "../../components/others/CreateButton.tsx";
import PageHeader from "../../components/others/PageHeader.tsx";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageProfile?: string;
  roleId?: {
    name: string;
  };
  specialityId?: {
    name: string;
  };
}

interface Availability {
  _id: string;
  userId: User;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  dailyCapacity: number;
}

interface AvailabilitiesResponse {
  availabilities: Availability[];
}

interface UsersResponse {
  users: User[];
}

interface CreateAvailabilityData {
  userId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  dailyCapacity: number;
}

interface UpdateAvailabilityData {
  id: string;
  data: Partial<CreateAvailabilityData>;
}

const Availability: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [availabilityToDelete, setAvailabilityToDelete] = useState<Availability | null>(null);
  const [doctors, setDoctors] = useState<User[]>([]);
  
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
  } = useHandleForm<Availability>();

  // Get availabilities data
  const { data: availabilities, isLoading: isLoadingAvailabilities } = useQuery<AvailabilitiesResponse>({
    queryKey: ["availabilities"],
    queryFn: getAvailabilities,
  });

  // Get all users and filter doctors
  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Search hook - using useSearch instead of HandleSearch
  const filteredData = useSearch(availabilities?.availabilities, searchTerm);

  // Create availability mutation
  const createAvailabilityMutation = useMutation({
    mutationFn: createAvailability,
    onSuccess: () => {
      toast.success("Availability created successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      handleCloseForms();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create availability",
      );
    },
  });

  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      toast.success("Availability updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      handleCloseForms();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update availability",
      );
    },
  });

  // Delete availability mutation
  const deleteAvailabilityMutation = useMutation({
    mutationFn: deleteAvailability,
    onSuccess: () => {
      toast.success("Availability deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["availabilities"] });
      setDeleteModalOpen(false);
      setAvailabilityToDelete(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete availability",
      );
    },
  });

  const handleCreateAvailability = async (availabilityData: CreateAvailabilityData): Promise<void> => {
    createAvailabilityMutation.mutate(availabilityData);
  };

  const handleUpdateAvailability = async (availabilityData: Partial<CreateAvailabilityData>): Promise<void> => {
    if (selectedAvailability) {
      const updateData: UpdateAvailabilityData = {
        id: selectedAvailability._id,
        data: availabilityData,
      };
      updateAvailabilityMutation.mutate(updateData);
    }
  };

  const handleDeleteClick = (availability: Availability): void => {
    setAvailabilityToDelete(availability);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (availabilityToDelete) {
      deleteAvailabilityMutation.mutate(availabilityToDelete._id);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setAvailabilityToDelete(null);
  };

  const formatDayOfWeek = (day: string): string => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getUserName = (availability: Availability): string => {
    if (availability.userId?.firstName) {
      return `${availability.userId.firstName} ${availability.userId.lastName}`;
    }
    return "Unknown User";
  };

  useEffect(() => {
    if (!usersData?.users) return;

    const filterDoctors = (): void => {
      const doctorsList = usersData.users.filter(user => 
        user.roleId?.name?.toLowerCase() === 'doctor'
      );
      
      console.log("Filtered Doctors:", doctorsList);
      setDoctors(doctorsList);
    };

    filterDoctors();
  }, [usersData]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Availability Management"
            subtitle="Manage doctor schedules and daily capacities"
            titleClassName="text-3xl font-light text-white mb-2 flex items-center gap-3"
            subtitleClassName="text-gray-300"
          >
            <FiCalendar className="w-8 h-8 text-lime-400" />
          </PageHeader>

          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by doctor name, day of week..."
            />

            <CreateButton
              onClick={handleCreateClick}
              isLoading={createAvailabilityMutation.isLoading}
              loadingText="Creating..."
              normalText="Add Availability"
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
                    Doctor
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
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((availability: Availability) => (
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
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const nextSibling = target.nextSibling as HTMLElement;
                                    if (nextSibling) {
                                      nextSibling.style.display = "flex";
                                    }
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
                              {availability.userId?.specialityId && (
                                <div className="text-xs text-lime-400">
                                  {availability.userId.specialityId.name}
                                </div>
                              )}
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
                      <td colSpan={5} className="py-12 px-6 text-center">
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
            users={doctors}
            availabilities={availabilities?.availabilities || []}
          />
        )}

        {showUpdateForm && (
          <UpdateAvailabilityForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateAvailability}
            isLoading={updateAvailabilityMutation.isLoading}
            availability={selectedAvailability}
            users={doctors}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Availability"
          message={`Are you sure you want to delete the availability for ${availabilityToDelete ? getUserName(availabilityToDelete) : 'this doctor'} on ${availabilityToDelete ? formatDayOfWeek(availabilityToDelete.dayOfWeek) : 'this day'}?`}
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