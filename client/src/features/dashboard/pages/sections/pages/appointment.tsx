import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar, FiUser, FiStar } from 'react-icons/fi';
import CreateAppointmentForm from '../../components/forms/appointment/CreateAppointmentForm.tsx';
import UpdateAppointmentForm from '../../components/forms/appointment/UpdateAppointmentForm.tsx';
import { HandleSearch } from '../../../../../constants/useSearch';
import { useHandleForm } from '../../../../../constants/handelsConstants';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, updateAppointmentStatus } from '../../services/appointmentApi';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '../../../../../ui/toasts/toast';
import ConfirmationModal from '../../components/others/ConfirmationModal.tsx';
import { getStatusColor } from '../../constants/statusAppointmentColor';


const AppointmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  
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
  } = useHandleForm();

  // Get appointments data
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });

  // Search hook
  const filteredData = HandleSearch(appointments?.appointments, searchTerm);

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Appointment created successfully!");
      queryClient.invalidateQueries(["appointments"]);
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create appointment");
    },
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      toast.success("Appointment updated successfully!");
      queryClient.invalidateQueries(["appointments"]);
      setShowUpdateForm(false);
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update appointment");
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      toast.success("Appointment status updated!");
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      toast.success("Appointment deleted successfully!");
      queryClient.invalidateQueries(["appointments"]);
      setDeleteModalOpen(false);
      setAppointmentToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    },
  });

  const handleCreateAppointment = async (appointmentData) => {
    createAppointmentMutation.mutate(appointmentData);
  };

  const handleUpdateAppointment = async (appointmentData) => {
    if (selectedAppointment) {
      updateAppointmentMutation.mutate({
        id: selectedAppointment._id,
        data: appointmentData
      });
    }
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    updateStatusMutation.mutate({
      id: appointmentId,
      status: newStatus
    });
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointmentMutation.mutate(appointmentToDelete._id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };



  // if (isLoadingAppointments) {
  //   return (
  //     <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
  //       <div className="text-white text-lg">Loading appointments...</div>
  //     </div>
  //   );
  // }

  return (
  <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-light text-white mb-2">
          Appointments Management
        </h1>
        <p className="text-gray-300">
          Manage patient appointments and schedules
        </p>
      </div>
      
      {/* Search Bar - Moved to header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search appointments by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={handleCreateClick}
          disabled={createAppointmentMutation.isLoading}
          className="bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <FiPlus className="w-5 h-5" />
          {createAppointmentMutation.isLoading ? "Creating..." : "Create New Appointment"}
        </button>
      </div>
    </div>

    {/* Appointments Table */}
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Patient</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Doctor</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Date & Time</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Queue</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <tbody>
              {filteredData?.length > 0 ? (
                filteredData?.map((appointment) => (
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
                            {appointment.patientId.firstName} {appointment.patientId.lastName}
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
                            Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {appointment.doctorId.specialityId?.name}
                          </div>
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
                        <FiStar className="w-4 h-4 text-yellow-400" />
                        #{appointment.queueNumber}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        disabled={updateStatusMutation.isLoading}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-lime-400 bg-gray-800 text-white ${
                          getStatusColor(appointment.status)
                        } disabled:opacity-50`}
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
                          disabled={updateAppointmentMutation.isLoading}
                          className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                          title="Edit appointment"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(appointment)}
                          disabled={deleteAppointmentMutation.isLoading}
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
                  <td colSpan="6" className="py-12 px-6 text-center">
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
        isLoading={createAppointmentMutation.isLoading}
      />
    )}

    {showUpdateForm && (
      <UpdateAppointmentForm
        onClose={handleCloseForms}
        onSubmit={handleUpdateAppointment}
        appointment={selectedAppointment}
        isLoading={updateAppointmentMutation.isLoading}
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
      isLoading={deleteAppointmentMutation.isLoading}
      variant="danger"
    />
  </div>
</div>
  );
};

export default AppointmentsPage;