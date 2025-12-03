import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiUser,
  FiUserCheck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrash2,
  FiBriefcase,
  FiEye,
  FiPhone,
  FiActivity,
  FiShield,
  FiHeart,
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorAppointments,
  getNurseAppointments,
  getPatientAppointments,
  deleteAppointment,
  updateAppointmentStatus,
  assignNurseToAppointment,
} from "../dashboard/pages/services/appointmentApi";
import { getUsers } from "../dashboard/pages/services/usersApi";
import { useToast } from "../../ui/toasts/toast";
import ConfirmationModal from "../dashboard/pages/components/others/ConfirmationModal";
import { getStatusColor } from "../dashboard/pages/constants/statusAppointmentColor";
import SearchInput from "../dashboard/pages/components/others/SearchBar";

export default function MyAppointment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchAppointmentsByRole = async () => {
    if (!role || !userId) return [];

    try {
      switch (role.toLowerCase()) {
        case "doctor": {
          const res = await getDoctorAppointments(userId);
          return res?.doctorAppointments || [];
        }

        case "nurse": {
          const res = await getNurseAppointments(userId);
          return res?.nurseAppointments || [];
        }

        case "patient": {
          const res = await getPatientAppointments(userId);
          return res?.patientAppointments || [];
        }

        default:
          return [];
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  };

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments", role, userId],
    queryFn: fetchAppointmentsByRole,
    enabled: !!role && !!userId,
  });

  const { data: nursesData = [], isLoading: isLoadingNurses } = useQuery({
    queryKey: ["nurses"],
    queryFn: async () => {
      const users = await getUsers();
      return (
        users?.users?.filter(
          (user) => user.roleId?.name?.toLowerCase() === "nurse"
        ) || []
      );
    },
    enabled: role?.toLowerCase() === "doctor",
  });

  const filteredAppointments = React.useMemo(() => {
    if (!searchTerm || !appointments.length) return appointments;

    const term = searchTerm.toLowerCase();
    return appointments.filter((app) => {
      let doctorName = "";
      if (app.doctorId && typeof app.doctorId === "object") {
        doctorName =
          `${app.doctorId.firstName || ""} ${app.doctorId.lastName || ""}`.toLowerCase();
      }

      let patientName = "";
      if (app.patientId && typeof app.patientId === "object") {
        patientName =
          `${app.patientId.firstName || ""} ${app.patientId.lastName || ""}`.toLowerCase();
      }

      let nurseName = "";
      if (app.nurseId && typeof app.nurseId === "object") {
        nurseName =
          `${app.nurseId.firstName || ""} ${app.nurseId.lastName || ""}`.toLowerCase();
      }

      const dateStr = new Date(app.date).toLocaleDateString();
      const status = app.status?.toLowerCase() || "";

      return (
        doctorName.includes(term) ||
        patientName.includes(term) ||
        nurseName.includes(term) ||
        dateStr.includes(term) ||
        status.includes(term)
      );
    });
  }, [appointments, searchTerm]);

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

  const assignNurseMutation = useMutation({
    mutationFn: assignNurseToAppointment,
    onSuccess: async () => {
      toast.success("Nurse assigned successfully!");
      await queryClient.invalidateQueries({
        queryKey: ["appointments", role, userId],
      });
      await refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign nurse");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAppointment(id),
    onSuccess: () => {
      toast.success("Appointment deleted successfully!");
      queryClient.invalidateQueries(["appointments", role, userId]);
      setAppointmentToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment"
      );
    },
  });

  const isDoctor = role?.toLowerCase() === "doctor";
  const isNurse = role?.toLowerCase() === "nurse";
  const isPatient = role?.toLowerCase() === "patient";
  const canChangeStatus = isDoctor || isNurse;
  const canAssignNurse = isDoctor;
  const canDelete = isDoctor || isPatient;
  const canViewPatientDetails = isDoctor || isNurse;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    if (newStatus) {
      const statusData = {
        id: appointmentId,
        status: newStatus,
      };
      updateStatusMutation.mutate(statusData);
    }
  };

  const handleNurseChange = (appointmentId, nurseId) => {
    if (nurseId) {
      const nurseData = {
        appointmentId: appointmentId,
        nurseId: nurseId,
      };
      assignNurseMutation.mutate(nurseData);
    }
  };

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
  };

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      deleteMutation.mutate(appointmentToDelete._id);
    }
  };

  const handleCancelDelete = () => {
    setAppointmentToDelete(null);
  };

  const getDisplayName = (person) => {
    if (!person) return "Not assigned";
    if (typeof person === "string") return "Not available";
    if (typeof person === "object") {
      return (
        `${person.firstName || ""} ${person.lastName || ""}`.trim() || "Unknown"
      );
    }
    return "Unknown";
  };

  const getProfileImage = (person) => {
    if (!person || typeof person !== "object") return null;
    return person.imageProfile;
  };

  const getPhoneNumber = (person) => {
    if (!person || typeof person !== "object") return null;
    return person.numberPhone || person.phone || null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiClock className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-gray-300">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <FiXCircle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">
              Error Loading Appointments
            </h2>
          </div>
          <p className="text-gray-300 mb-4">
            {error.message || "Failed to load appointments"}
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-white mb-2 flex items-center gap-2">
                <FiCalendar className="w-6 h-6 text-lime-400" />
                My Appointments
              </h1>
              <p className="text-gray-400">
                {isDoctor && "Manage your patient appointments and schedules"}
                {isNurse && "View and manage appointments assigned to you"}
                {isPatient && "View and manage your medical appointments"}
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <span className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg">
                {filteredAppointments.length} total
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="w-full">
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search by name, date, or status..."
              />
            </div>
          </div>
        </motion.div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <FiCalendar className="w-20 h-20 mx-auto mb-6 text-gray-500" />
            <p className="text-xl font-medium text-gray-400 mb-3">
              No appointments found
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms"
                : "You don't have any appointments scheduled yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((app) => {
              const statusColor = getStatusColor(app.status);
              const doctorImage = getProfileImage(app.doctorId);
              const patientImage = getProfileImage(app.patientId);
              const nurseImage = getProfileImage(app.nurseId);

              return (
                <motion.div
                  key={app?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl hover:border-lime-400/30 transition-colors group relative"
                >
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border border-gray-800 ${statusColor}`}
                    >
                      {app.status || "Unknown"}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <FiCalendar className="w-5 h-5 text-lime-400" />
                        <span className="font-medium text-lg">
                          {formatDate(app.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="ml-auto text-sm bg-gray-900 border border-gray-800 px-2 py-1 rounded">
                          Queue #{app.queueNumber}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                            {doctorImage ? (
                              <img
                                src={`http://localhost:8000${doctorImage}`}
                                alt="Doctor"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <FiBriefcase className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            Dr. {getDisplayName(app.doctorId)}
                          </p>
                          <p className="text-xs text-gray-400">Doctor</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                            {patientImage ? (
                              <img
                                src={`http://localhost:8000${patientImage}`}
                                alt="Patient"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <FiHeart className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white truncate">
                                {getDisplayName(app.patientId)}
                              </p>
                              <p className="text-xs text-gray-400">Patient</p>
                            </div>
                            {canViewPatientDetails &&
                              app.patientId &&
                              typeof app.patientId === "object" && (
                                <button
                                  onClick={() =>
                                    setSelectedPatient(app.patientId)
                                  }
                                  className="text-lime-400 hover:text-lime-300 transition-colors p-1"
                                  title="View Patient Details"
                                >
                                  <FiEye className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
                            {nurseImage ? (
                              <img
                                src={`http://localhost:8000${nurseImage}`}
                                alt="Nurse"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUserCheck className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                            <FiShield className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          {canAssignNurse ? (
                            <div>
                              <select
                                value={
                                  app?.nurseId && typeof app.nurseId === "object"
                                    ? app.nurseId._id || ""
                                    : app?.nurseId || ""
                                }
                                onChange={(e) =>
                                  handleNurseChange(app?._id, e.target.value)
                                }
                                disabled={
                                  assignNurseMutation.isLoading ||
                                  isLoadingNurses
                                }
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50"
                              >
                                <option value="">
                                  {app?.nurseId
                                    ? "Change Nurse"
                                    : "Assign Nurse"}
                                </option>

                                {nursesData.map((nurse) => (
                                  <option key={nurse._id} value={nurse._id}>
                                    {nurse.firstName} {nurse.lastName}
                                  </option>
                                ))}
                              </select>

                              <p className="text-xs text-gray-400 mt-1">
                                Nurse
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-white truncate">
                                {getDisplayName(app.nurseId)}
                              </p>
                              <p className="text-xs text-gray-400">Nurse</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                      {canChangeStatus && (
                        <div className="flex-1">
                          <select
                            value={app.status || ""}
                            onChange={(e) =>
                              handleStatusChange(app?._id, e.target.value)
                            }
                            disabled={updateStatusMutation.isLoading}
                            className="w-full px-3 py-2 rounded-lg text-sm bg-gray-900 border border-gray-800 text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50"
                          >
                            <option value="scheduled">
                              <FiClock className="inline w-4 h-4 mr-2 text-yellow-400" />
                              Scheduled
                            </option>
                            <option value="in progress">
                              <FiActivity className="inline w-4 h-4 mr-2 text-blue-400" />
                              In Progress
                            </option>
                            <option value="completed">
                              <FiCheckCircle className="inline w-4 h-4 mr-2 text-green-400" />
                              Completed
                            </option>
                            <option value="cancelled">
                              <FiXCircle className="inline w-4 h-4 mr-2 text-red-400" />
                              Cancelled
                            </option>
                          </select>
                        </div>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(app)}
                          disabled={deleteMutation.isLoading}
                          className="w-full px-4 py-2 bg-gray-900 border border-red-800 text-red-400 rounded-lg hover:border-red-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-lime-400" />
                    Patient Information
                  </h3>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiXCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-lime-400/30 border border-gray-800 flex items-center justify-center overflow-hidden">
                      {selectedPatient?.imageProfile ? (
                        <img
                          src={`http://localhost:8000${selectedPatient.imageProfile}`}
                          alt="Patient"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Patient Name</p>
                      <p className="text-xl font-medium text-white">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getPhoneNumber(selectedPatient) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <FiPhone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="text-white font-medium">
                            {getPhoneNumber(selectedPatient)}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedPatient.email && (
                      <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400">Email Address</p>
                        <p className="text-white font-medium truncate">
                          {selectedPatient.email}
                        </p>
                      </div>
                    )}

                    {selectedPatient.dateOfBirth && (
                      <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400">Date of Birth</p>
                        <p className="text-white font-medium">
                          {new Date(
                            selectedPatient.dateOfBirth
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="px-4 py-2 bg-gray-900 border border-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={!!appointmentToDelete}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Appointment"
          message={`Are you sure you want to delete this appointment? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isLoading}
          variant="danger"
        />
      </div>
    </div>
  );
}