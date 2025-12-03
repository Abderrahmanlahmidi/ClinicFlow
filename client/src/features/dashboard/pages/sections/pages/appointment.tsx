import { useState } from "react";
import { FiEdit2, FiTrash2, FiCalendar, FiUser, FiStar } from "react-icons/fi";
import CreateAppointmentForm from "../../components/forms/appointment/CreateAppointmentForm.tsx";
import UpdateAppointmentForm from "../../components/forms/appointment/UpdateAppointmentForm.tsx";
import { useSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  assignNurseToAppointment,
} from "../../services/appointmentApi";
import { getUsers } from "../../services/usersApi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import ConfirmationModal from "../../components/others/ConfirmationModal.tsx";
import { getStatusColor } from "../../constants/statusAppointmentColor";
import SearchInput from "../../components/others/SearchBar.tsx";
import CreateButton from "../../components/others/CreateButton.tsx";
import PageHeader from "../../components/others/PageHeader.tsx";

// Types
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  imageProfile?: string;
  specialityId?: {
    name: string;
  };
  roleId?: {
    name: string;
  };
}

interface Appointment {
  _id: string;
  patientId: User;
  doctorId: User;
  nurseId?: User | null;
  date: string;
  queueNumber: number;
  status: 'scheduled' | 'in progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface CreateAppointmentData {
  patientId: string;
  doctorId: string;
  date: string;
  queueNumber: number;
  status: string;
}

interface UpdateAppointmentData {
  id: string;
  data: Partial<CreateAppointmentData>;
}

interface StatusUpdateData {
  id: string;
  status: string;
}

interface NurseAssignmentData {
  appointmentId: string;
  nurseId: string;
}

const AppointmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    selectedUser: selectedAppointment,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser: setSelectedAppointment,
  } = useHandleForm<Appointment>();

  // Get appointments data
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery<{ appointments: Appointment[] }>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  // Get all users and filter nurses
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Filter nurses from users
  const nurses = usersData?.users?.filter((user: User) => 
    user.roleId?.name?.toLowerCase() === 'nurse'
  ) || [];

  // Search hook
  const filteredAppointments = useSearch<Appointment>(appointments?.appointments || [], searchTerm);

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Appointment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setShowCreateForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
    },
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      toast.success("Appointment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setShowUpdateForm(false);
      setSelectedAppointment(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update appointment"
      );
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      toast.success("Appointment status updated!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Assign nurse mutation
  const assignNurseMutation = useMutation({
    mutationFn: assignNurseToAppointment,
    onSuccess: () => {
      toast.success("Nurse assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign nurse");
    },
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      toast.success("Appointment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setDeleteModalOpen(false);
      setAppointmentToDelete(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    },
  });

  const handleCreateAppointment = async (appointmentData: CreateAppointmentData): Promise<void> => {
    createAppointmentMutation.mutate(appointmentData);
  };

  const handleUpdateAppointment = async (appointmentData: Partial<CreateAppointmentData>): Promise<void> => {
    if (selectedAppointment) {
      const updateData: UpdateAppointmentData = {
        id: selectedAppointment._id,
        data: appointmentData
      };
      updateAppointmentMutation.mutate(updateData);
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: string): void => {
    const statusData: StatusUpdateData = {
      id: appointmentId,
      status: newStatus
    };
    updateStatusMutation.mutate(statusData);
  };

  const handleNurseChange = (appointmentId: string, nurseId: string): void => {
    if (nurseId) {
      const nurseData: NurseAssignmentData = {
        appointmentId: appointmentId,
        nurseId: nurseId
      };
      assignNurseMutation.mutate(nurseData);
    }
  };

  const handleDeleteClick = (appointment: Appointment): void => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (appointmentToDelete) {
      deleteAppointmentMutation.mutate(appointmentToDelete._id);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };


  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Appointments Management"
            subtitle="Manage patient appointments and schedules"
          />

          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search appointments..."
            />

            <CreateButton
              onClick={handleCreateClick}
              isLoading={createAppointmentMutation.status === "loading"}
              loadingText="Creating appointment..."
              normalText="Create New Appointment"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Patient
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Doctor
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Nurse
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Date & Time
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Queue
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Status
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
                  {filteredAppointments && filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment: Appointment) => (
                      <tr
                        key={appointment._id}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        {/* Patient Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600">
                              {appointment.patientId.imageProfile ? (
                                <img
                                  src={`http://localhost:8000${appointment.patientId.imageProfile}`}
                                  alt={`${appointment.patientId.firstName} ${appointment.patientId.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {appointment.patientId.firstName}{" "}
                                {appointment.patientId.lastName}
                              </div>
                              <div className="text-sm text-gray-400">
                                Patient
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Doctor Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600">
                              {appointment.doctorId.imageProfile ? (
                                <img
                                  src={`http://localhost:8000${appointment.doctorId.imageProfile}`}
                                  alt={`${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                Dr. {appointment.doctorId.firstName}{" "}
                                {appointment.doctorId.lastName}
                              </div>
                              <div className="text-sm text-gray-400">
                                {appointment.doctorId.specialityId?.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Nurse Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600">
                              {appointment.nurseId?.imageProfile ? (
                                <img
                                  src={`http://localhost:8000${appointment.nurseId.imageProfile}`}
                                  alt={`${appointment.nurseId.firstName} ${appointment.nurseId.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <select
                                value={appointment.nurseId?._id || ""}
                                onChange={(e) => handleNurseChange(appointment._id, e.target.value)}
                                disabled={assignNurseMutation.status === "loading"}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50"
                              >
                                <option value="">No Nurse</option>
                                {nurses.map((nurse: User) => (
                                  <option key={nurse._id} value={nurse._id}>
                                    {nurse.firstName} {nurse.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 text-gray-300">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Queue Number */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiStar className="w-4 h-4 text-yellow-400" />#
                            {appointment.queueNumber}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <select
                            value={appointment.status}
                            onChange={(e) =>
                              handleStatusChange(
                                appointment._id,
                                e.target.value
                              )
                            }
                            disabled={updateStatusMutation.status === "loading"}
                            className={`px-3 py-1 rounded-full text-xs font-medium border-1 border-gray-600  focus:ring-2 focus:ring-lime-400 bg-gray-900 text-white ${getStatusColor(
                              appointment.status
                            )} disabled:opacity-50`}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(appointment)}
                              disabled={updateAppointmentMutation.status === "loading"}
                              className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                              title="Edit appointment"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(appointment)}
                              disabled={deleteAppointmentMutation.status === "loading"}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Delete appointment"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-6 text-center">
                        <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No appointments found
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No appointments scheduled yet"}
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
          <CreateAppointmentForm
            onClose={handleCloseForms}
            onSubmit={handleCreateAppointment}
            isLoading={createAppointmentMutation.status === "loading"}
          />
        )}

        {showUpdateForm && (
          <UpdateAppointmentForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateAppointment}
            appointment={selectedAppointment}
            isLoading={updateAppointmentMutation.status === "loading"}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Appointment"
          message={`Are you sure you want to delete this appointment? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteAppointmentMutation.status === "loading"}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default AppointmentsPage;