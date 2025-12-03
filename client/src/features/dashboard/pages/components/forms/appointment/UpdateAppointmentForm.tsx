import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { getUsers } from "../../../services/usersApi.tsx";

const UpdateAppointmentForm = ({
  onClose,
  onSubmit,
  appointment,
  isLoading,
}) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        const patientsList = usersData.users.filter(
          (user) => user.roleId?.name === "Patient",
        );
        const doctorsList = usersData.users.filter(
          (user) => user.roleId?.name === "Doctor",
        );

        setPatients(patientsList);
        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (appointment) {
      setValue("doctorId", appointment.doctorId._id);
      setValue("patientId", appointment.patientId._id);
      setValue("date", new Date(appointment.date).toISOString().split("T")[0]);
    }
  }, [appointment, setValue]);

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error updating appointment:", error);
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
          <h2 className="text-xl font-light text-white">Update Appointment</h2>
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
              Doctor
            </label>
            <select
              {...register("doctorId", {
                required: "Doctor is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.doctorId ? "border-red-500" : "border-gray-600"
              }`}
              disabled={loadingUsers}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} -{" "}
                  {doctor.specialityId?.name}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="mt-1 text-sm text-red-400">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Patient
            </label>
            <select
              {...register("patientId", {
                required: "Patient is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.patientId ? "border-red-500" : "border-gray-600"
              }`}
              disabled={loadingUsers}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-400">
                {errors.patientId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400 ${
                errors.date ? "border-red-500" : "border-gray-600"
              }`}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
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
              disabled={isLoading || loadingUsers}
              className="px-4 py-2 bg-lime-400 text-gray-900 rounded-lg hover:bg-lime-300 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointmentForm;
