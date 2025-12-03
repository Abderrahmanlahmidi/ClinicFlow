import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiLoader,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { useToast } from "../../../ui/toasts/toast";
import { getSpecialities } from "../../dashboard/pages/services/specialityApi";
import { getUsers } from "../../dashboard/pages/services/usersApi";
import { getAvailabilities } from "../../dashboard/pages/services/availabilityApi";
import { createAppointment } from "../../dashboard/pages/services/appointmentApi";


interface Role {
  _id?: string;
  name: string;
  description?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  roleId: Role;
  specialityId?: { _id: string; name?: string } | string | null;
  imageProfile?: string;
}

interface Speciality {
  _id: string;
  name: string;
  description?: string;
}

interface Availability {
  _id: string;
  userId: { _id: string; firstName?: string; lastName?: string; email?: string; imageProfile?: string } | string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  dailyCapacity: number;
}

interface SpecialitiesResponse {
  message?: string;
  specialities?: Speciality[];
}

interface UsersResponse {
  users: User[];
}

interface AvailabilitiesResponse {
  success?: boolean;
  availabilities?: Availability[];
}

interface CreateAppointmentFormData {
  patientId?: string;
  doctorId?: string;
  specialityId?: string;
  date?: string;
}

const CreateAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // localStorage values (strings). normalize to lowercase role to compare.
  const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const storedRoleRaw = typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";
  const userRole = storedRoleRaw.toLowerCase();
  const userId = storedUserId;

  // UI state
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [doctorAvailabilities, setDoctorAvailabilities] = useState<Availability[]>([]);

  // react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppointmentFormData>({
    defaultValues: {
      patientId: userRole === "patient" || userRole === "nurse" || userRole === "admin" ? userId : "",
      doctorId: userRole === "doctor" ? userId : "",
      specialityId: "",
      date: "",
    },
  });

  // watch fields
  const watchSpeciality = watch("specialityId");
  const watchDoctor = watch("doctorId");

  const isPatientLike = userRole === "patient" || userRole === "nurse" || userRole === "admin";
  const isDoctor = userRole === "doctor";

  // ========== QUERIES ==========

  // 1) Patients list (only for doctors to choose a patient)
  const {
    data: patientsData,
    isLoading: isLoadingPatients,
    error: patientsError,
  } = useQuery<UsersResponse, Error>({
    queryKey: ["users", "patients"],
    queryFn: async () => {
      const res = await getUsers();
      return { users: res.users.filter((u: User) => u.roleId.name.toLowerCase() === "patient") };
    },
    enabled: isDoctor, // only fetch when the logged user is a doctor
    staleTime: 1000 * 60 * 5,
  });

  // 2) Specialities (for patient/nurse/admin)
  const {
    data: specialitiesResp,
    isLoading: isLoadingSpecialities,
    error: specialitiesError,
  } = useQuery<SpecialitiesResponse, Error>({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
    enabled: isPatientLike,
    staleTime: 1000 * 60 * 10,
  });

  // 3) Doctors list filtered by speciality (for patient/nurse/admin)
  const {
    data: doctorsResp,
    isLoading: isLoadingDoctors,
    isFetching: isFetchingDoctors,
  } = useQuery<UsersResponse, Error>({
    queryKey: ["users", "doctors", watchSpeciality || "none"],
    queryFn: async () => {
      const res = await getUsers();
      // filter doctors and by speciality (watchSpeciality contains specialityId)
      const doctors = res.users.filter(
        (u: User) =>
          u.roleId.name.toLowerCase() === "doctor" &&
          // handle specialityId being stored either as string id or object
          ((typeof u.specialityId === "string" && u.specialityId === watchSpeciality) ||
            (u.specialityId && typeof u.specialityId !== "string" && (u.specialityId as any)._id === watchSpeciality))
      );
      return { users: doctors };
    },
    enabled: !!watchSpeciality && isPatientLike,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // 4) Availabilities (fetch all, we'll filter for selected doctor in an effect)
  const {
    data: availabilitiesResp,
    isLoading: isLoadingAvailability,
    error: availabilityError,
  } = useQuery<AvailabilitiesResponse, Error>({
    queryKey: ["availabilities"],
    queryFn: getAvailabilities,
    enabled: !!(isDoctor || watchDoctor), // fetch if we have a target doctor (or user is doctor)
    staleTime: 1000 * 60 * 2,
  });

  // Determine the target doctor id:
  // - If logged user is doctor -> targetDoctorId = userId
  // - else -> watch doctor selection from form
  const targetDoctorId = isDoctor ? userId : watchDoctor || "";

  // Effect: whenever availabilitiesResp or targetDoctorId changes, filter and compute availableDays
  useEffect(() => {
    if (!availabilitiesResp?.availabilities) {
      setAvailableDays([]);
      setDoctorAvailabilities([]);
      return;
    }

    if (!targetDoctorId) {
      setAvailableDays([]);
      setDoctorAvailabilities([]);
      return;
    }

    const allAvail = availabilitiesResp.availabilities;

    // Normalize userId inside availability (it can be either object or string)
    const doctorAvailabilitiesFiltered: Availability[] = allAvail.filter((a) => {
      const uid =
        typeof a.userId === "string"
          ? a.userId
          : (a.userId && (a.userId as any)._id) || (a.userId as any).id || "";
      return uid === targetDoctorId;
    });

    const days = Array.from(new Set(doctorAvailabilitiesFiltered.map((a) => a.dayOfWeek)));
    setDoctorAvailabilities(doctorAvailabilitiesFiltered);
    setAvailableDays(days);
  }, [availabilitiesResp, targetDoctorId]);

  // Ensure when the logged user is a doctor we set the doctorId in the form once
  useEffect(() => {
    if (isDoctor && userId) {
      setValue("doctorId", userId);
    }
    // when the logged user is patient/nurse/admin set patientId to his id
    if (isPatientLike && userId) {
      setValue("patientId", userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDoctor, isPatientLike, userId]);

  // If speciality selection changes we should reset doctor & date
  useEffect(() => {
    // reset doctor and date when speciality changes
    setValue("doctorId", "");
    setValue("date", "");
    setAvailableDays([]);
    setDoctorAvailabilities([]);
    // no dependency on setValue to avoid unnecessary runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSpeciality]);

  // If doctor selection changes reset date
  useEffect(() => {
    setValue("date", "");
    setAvailableDays([]); // will be repopulated by availability effect after availabilitiesResp is available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDoctor]);

  // ========== MUTATION ==========

  const createAppointmentMutation = useMutation({
    mutationFn: (payload: any) => createAppointment(payload),
    onSuccess: () => {
      toast.success("Appointment created successfully!");
      resetForm();
      navigate("/appointments");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Failed to create appointment";
      toast.error(message);
    },
  });

  // ========== HELPERS ==========

  const resetForm = () => {
    reset();
    setAvailableDays([]);
    setDoctorAvailabilities([]);
  };

  const formatDayName = (day: string) => {
    if (!day) return "";
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  // Submit handler
  const onSubmit = (data: CreateAppointmentFormData) => {
    // Basic validation enforcement (react-hook-form handles most, but double-check)
    const doctorIdPayload = isDoctor ? userId : data.doctorId;
    const patientIdPayload = isPatientLike ? userId : data.patientId;

    if (!doctorIdPayload) {
      toast.error("Please select a doctor.");
      return;
    }
    if (!patientIdPayload) {
      toast.error("Please select a patient.");
      return;
    }
    if (!data.date) {
      toast.error("Please choose a date.");
      return;
    }

    // Format date to ISO date (YYYY-MM-DD)
    const isoDate = new Date(data.date).toISOString().split("T")[0];

    const payload = {
      doctorId: doctorIdPayload,
      patientId: patientIdPayload,
      date: isoDate,
      // Optionally you could include availabilityId if your backend expects it.
      // availabilityId: selectedAvailabilityId
    };

    createAppointmentMutation.mutate(payload);
  };

  // Convenience values for rendering
  const specialities = specialitiesResp?.specialities || [];
  const doctorsList = doctorsResp?.users || [];
  const patientsList = patientsData?.users || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-light text-white mb-2">Create Appointment</h1>
          <p className="text-gray-400">
            {isDoctor ? "Schedule an appointment with a patient" : "Book an appointment with a doctor"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 md:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4" />
                  Select Patient {isDoctor ? "*" : ""}
                </div>
              </label>

              {isDoctor ? (
                <>
                  <select
                    {...register("patientId", { required: "Patient is required" })}
                    disabled={isLoadingPatients || isSubmitting}
                    className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
                      errors.patientId ? "border-red-500" : "border-gray-600"
                    } ${isLoadingPatients || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Select patient...</option>
                    {patientsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>

                  {errors.patientId && <p className="mt-1 text-sm text-red-400">{errors.patientId.message}</p>}
                  {isLoadingPatients && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <FiLoader className="w-3 h-3 animate-spin" />
                      Loading patients...
                    </div>
                  )}
                  {patientsError && <p className="mt-2 text-sm text-red-400">Failed to load patients</p>}
                </>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <FiUser className="w-4 h-4 text-lime-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Your appointment</p>
                      <p className="text-sm text-gray-400">You are the patient</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SPECIALITY SELECTION - Only for patient/nurse/admin */}
            {isPatientLike && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4" />
                    Select Speciality *
                  </div>
                </label>

                <select
                  {...register("specialityId", { required: "Speciality is required" })}
                  disabled={isLoadingSpecialities || isSubmitting}
                  className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
                    errors.specialityId ? "border-red-500" : "border-gray-600"
                  } ${isLoadingSpecialities || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select speciality...</option>
                  {specialities.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {errors.specialityId && <p className="mt-1 text-sm text-red-400">{errors.specialityId.message}</p>}
                {isLoadingSpecialities && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <FiLoader className="w-3 h-3 animate-spin" />
                    Loading specialities...
                  </div>
                )}
                {specialitiesError && <p className="mt-2 text-sm text-red-400">Failed to load specialities</p>}
              </div>
            )}

            {/* DOCTOR SELECTION - Only for patient/nurse/admin with speciality */}
            {isPatientLike && watchSpeciality && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Select Doctor *
                  </div>
                </label>

                <select
                  {...register("doctorId", { required: "Doctor is required" })}
                  disabled={isLoadingDoctors || isFetchingDoctors || isSubmitting || !doctorsList.length}
                  className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
                    errors.doctorId ? "border-red-500" : "border-gray-600"
                  } ${isLoadingDoctors || isFetchingDoctors || isSubmitting || !doctorsList.length ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select doctor...</option>
                  {doctorsList.map((doctor) => {
                    const specName =
                      typeof doctor.specialityId === "string"
                        ? ""
                        : (doctor.specialityId && (doctor.specialityId as any).name) || "";
                    return (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.firstName} {doctor.lastName} {specName ? `(${specName})` : ""}
                      </option>
                    );
                  })}
                </select>

                {errors.doctorId && <p className="mt-1 text-sm text-red-400">{errors.doctorId.message}</p>}
                {(isLoadingDoctors || isFetchingDoctors) && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <FiLoader className="w-3 h-3 animate-spin" />
                    Loading doctors...
                  </div>
                )}
                {!isLoadingDoctors && !isFetchingDoctors && !doctorsList.length && (
                  <p className="mt-2 text-sm text-yellow-400">No doctors available for this speciality</p>
                )}
              </div>
            )}

            {/* DOCTOR INFO - For doctor user */}
            {isDoctor && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FiUser className="w-4 h-4 text-lime-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Your Appointment</p>
                    <p className="text-sm text-gray-400">You are the doctor for this appointment</p>
                  </div>
                </div>
              </div>
            )}

            {/* AVAILABILITY INFO (shows available days & date picker) */}
            {targetDoctorId && availableDays.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-300 mb-2">Available Days:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {formatDayName(day)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DATE SELECTION */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      Select Date *
                    </div>
                  </label>

                  <input
                    type="date"
                    {...register("date", {
                      required: "Date is required",
                      validate: {
                        futureDate: (value) => {
                          if (!value) return "Date is required";
                          const selectedDate = new Date(value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return selectedDate >= today || "Date must be today or in the future";
                        },
                      },
                    })}
                    disabled={isLoadingAvailability || isSubmitting}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent text-white ${
                      errors.date ? "border-red-500" : "border-gray-600"
                    } ${isLoadingAvailability || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  />

                  {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>}
                  {isLoadingAvailability && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <FiLoader className="w-3 h-3 animate-spin" />
                      Loading availability...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* If no availableDays but we have loaded availabilities */}
            {targetDoctorId && !isLoadingAvailability && availableDays.length === 0 && (
              <p className="text-sm text-yellow-400">This doctor has no available days configured.</p>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={createAppointmentMutation.isLoading || isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-lime-400 text-gray-900 rounded-lg font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAppointmentMutation.isLoading || isSubmitting ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Creating Appointment...
                  </>
                ) : (
                  <>
                    <FiCalendar className="w-5 h-5" />
                    Create Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* INFO BOX */}
        <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-4">
          <div className="flex items-start gap-3">
            <FiCheck className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-white mb-1">
                {isDoctor ? "Doctor Guidelines" : "Appointment Booking"}
              </h3>
              <ul className="text-sm text-gray-400 space-y-1">
                {isDoctor ? (
                  <>
                    <li>• You can only create appointments for your own schedule</li>
                    <li>• Select a patient from the list above</li>
                    <li>• Choose a date from your available days</li>
                  </>
                ) : (
                  <>
                    <li>• First select a medical speciality</li>
                    <li>• Then choose a doctor from that speciality</li>
                    <li>• Finally select a date from the doctor's available days</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;

