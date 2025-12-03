import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../ui/toasts/toast";
import { getSpecialities } from "../../dashboard/pages/services/specialityApi";
import { getUsers } from "../../dashboard/pages/services/usersApi";
import { getAvailabilities } from "../../dashboard/pages/services/availabilityApi";
import { createAppointment } from "../../dashboard/pages/services/appointmentApi";
import type { CreateAppointmentFormData, Availability } from "../types";
import { getLocalStorageValues } from "../utils/helpers";

export const useCreateAppointment = () => {
  const { userId, userRole } = getLocalStorageValues();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [doctorAvailabilities, setDoctorAvailabilities] = useState<Availability[]>([]);
  const hasInitializedRef = useRef(false);

  const isPatientLike = userRole === "patient" || userRole === "nurse" || userRole === "admin";
  const isDoctor = userRole === "doctor";

  const form = useForm<CreateAppointmentFormData>({
    defaultValues: {
      patientId: isPatientLike ? userId : "",
      doctorId: isDoctor ? userId : "",
      specialityId: "",
      date: "",
    },
  });

  const { watch, setValue, reset } = form;
  const watchSpeciality = watch("specialityId");
  const watchDoctor = watch("doctorId");
  const targetDoctorId = isDoctor ? userId : watchDoctor || "";

  // Reset everything when component unmounts or user changes
  useEffect(() => {
    return () => {
      // Clear all states when component unmounts
      setAvailableDays([]);
      setDoctorAvailabilities([]);
      hasInitializedRef.current = false;
    };
  }, []);

  // Initialize form values based on user role - ONLY ONCE
  useEffect(() => {
    if (!hasInitializedRef.current && userId) {
      if (isDoctor) {
        setValue("doctorId", userId);
        setValue("patientId", "");
      }
      if (isPatientLike) {
        setValue("patientId", userId);
        setValue("doctorId", "");
      }
      hasInitializedRef.current = true;
    }
  }, [isDoctor, isPatientLike, userId, setValue]);

  // Queries
  const patientsQuery = useQuery({
    queryKey: ["users", "patients"],
    queryFn: async () => {
      const res = await getUsers();
      return { 
        users: res.users.filter((u: any) => u.roleId.name.toLowerCase() === "patient") 
      };
    },
    enabled: isDoctor && !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const specialitiesQuery = useQuery({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
    enabled: isPatientLike && !!userId,
    staleTime: 1000 * 60 * 10,
  });

  const doctorsQuery = useQuery({
    queryKey: ["users", "doctors", watchSpeciality || "none"],
    queryFn: async () => {
      const res = await getUsers();
      const doctors = res.users.filter(
        (u: any) =>
          u.roleId.name.toLowerCase() === "doctor" &&
          ((typeof u.specialityId === "string" && u.specialityId === watchSpeciality) ||
            (u.specialityId && typeof u.specialityId !== "string" && u.specialityId._id === watchSpeciality))
      );
      return { users: doctors };
    },
    enabled: !!watchSpeciality && isPatientLike && !!userId,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // FIX: Always fetch availabilities when targetDoctorId exists
  const availabilitiesQuery = useQuery({
    queryKey: ["availabilities", targetDoctorId],
    queryFn: getAvailabilities,
    enabled: !!targetDoctorId,
    staleTime: 0, // Set to 0 to always refetch
    cacheTime: 1000 * 30, // Keep in cache for 30 seconds
  });

  // Process availabilities when data changes
  useEffect(() => {
    if (!availabilitiesQuery.data?.availabilities || !targetDoctorId) {
      setAvailableDays([]);
      setDoctorAvailabilities([]);
      return;
    }

    const allAvail = availabilitiesQuery.data.availabilities;
    const doctorAvailabilitiesFiltered: Availability[] = allAvail.filter((a: any) => {
      const uid = typeof a.userId === "string" ? a.userId : a.userId?._id || "";
      return uid === targetDoctorId;
    });

    const days = Array.from(new Set(doctorAvailabilitiesFiltered.map((a) => a.dayOfWeek)));
    setDoctorAvailabilities(doctorAvailabilitiesFiltered);
    setAvailableDays(days);
  }, [availabilitiesQuery.data, targetDoctorId]);

  // Reset form when speciality changes
  useEffect(() => {
    if (watchSpeciality && isPatientLike) {
      setValue("doctorId", "");
      setValue("date", "");
      // Force refetch of availabilities by invalidating the query
      queryClient.invalidateQueries(["availabilities"]);
    }
  }, [watchSpeciality, isPatientLike, setValue, queryClient]);

  // Reset date when doctor changes
  useEffect(() => {
    if (watchDoctor && isPatientLike) {
      setValue("date", "");
      // Force refetch for new doctor
      queryClient.invalidateQueries(["availabilities", targetDoctorId]);
    }
  }, [watchDoctor, isPatientLike, setValue, queryClient, targetDoctorId]);

  // Mutation
  const createAppointmentMutation = useMutation({
    mutationFn: (payload: any) => createAppointment(payload),
    onSuccess: () => {
      toast.success("Appointment created successfully!");
      // Reset form
      reset();
      setAvailableDays([]);
      setDoctorAvailabilities([]);
      // Invalidate all related queries
      queryClient.invalidateQueries(["availabilities"]);
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || "Failed to create appointment";
      toast.error(message);
    },
  });

  const handleSubmit = (data: CreateAppointmentFormData) => {
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

    const isoDate = new Date(data.date).toISOString().split("T")[0];
    const payload = {
      doctorId: doctorIdPayload,
      patientId: patientIdPayload,
      date: isoDate,
    };

    createAppointmentMutation.mutate(payload);
  };

  // Function to manually refresh availability data
  const refreshAvailability = () => {
    if (targetDoctorId) {
      queryClient.invalidateQueries(["availabilities", targetDoctorId]);
    }
  };

  return {
    form,
    isDoctor,
    isPatientLike,
    userId,
    userRole,
    availableDays,
    doctorAvailabilities,
    targetDoctorId,
    patientsQuery,
    specialitiesQuery,
    doctorsQuery,
    availabilitiesQuery,
    createAppointmentMutation,
    handleSubmit: form.handleSubmit(handleSubmit),
    watchSpeciality,
    refreshAvailability,
  };
};