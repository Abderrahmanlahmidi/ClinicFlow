import React, { useEffect } from "react";
import { useCreateAppointment } from "./hooks/useCreateAppointment";
import Header from "./components/Header";
import PatientSelection from "./components/PatientSelection";
import SpecialitySelection from "./components/SpecialitySelection";
import DoctorSelection from "./components/DoctorSelection";
import AvailabilityInfo from "./components/AvailabilityInfo";
import DateSelection from "./components/DateSelection";
import SubmitButton from "./components/Button";
import InfoBox from "./components/InfoBox";

const CreateAppointmentPage: React.FC = () => {
  const {
    form,
    isDoctor,
    isPatientLike,
    availableDays,
    targetDoctorId,
    patientsQuery,
    specialitiesQuery,
    doctorsQuery,
    availabilitiesQuery,
    createAppointmentMutation,
    handleSubmit,
    watchSpeciality,
    refreshAvailability,
  } = useCreateAppointment();

  const { register, formState: { errors, isSubmitting } } = form;

  // Refresh availability data when component mounts
  useEffect(() => {
    refreshAvailability();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Header isDoctor={isDoctor} />

        {/* Debug button for testing */}
        <button 
          onClick={refreshAvailability}
          className="hidden text-xs text-gray-400 hover:text-gray-300"
        >
          Refresh Data
        </button>

        {/* Form */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Selection */}
            <PatientSelection
              isDoctor={isDoctor}
              register={register}
              errors={errors}
              isLoadingPatients={patientsQuery.isLoading}
              patientsError={patientsQuery.error}
              patientsList={patientsQuery.data?.users || []}
              isSubmitting={isSubmitting}
            />

            {/* Speciality Selection */}
            {isPatientLike && (
              <SpecialitySelection
                register={register}
                errors={errors}
                isLoadingSpecialities={specialitiesQuery.isLoading}
                specialitiesError={specialitiesQuery.error}
                specialities={specialitiesQuery.data?.specialities || []}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Doctor Selection */}
            {isPatientLike && watchSpeciality && (
              <DoctorSelection
                register={register}
                errors={errors}
                isLoadingDoctors={doctorsQuery.isLoading}
                isFetchingDoctors={doctorsQuery.isFetching}
                doctorsList={doctorsQuery.data?.users || []}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Show loading state */}
            {availabilitiesQuery.isLoading && targetDoctorId && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
                  <span>Loading availability...</span>
                </div>
              </div>
            )}

            {/* Show availability info for doctors */}
            {isDoctor && !availabilitiesQuery.isLoading && (
              <AvailabilityInfo
                isDoctor={isDoctor}
                availableDays={availableDays}
                targetDoctorId={targetDoctorId}
                isLoadingAvailability={availabilitiesQuery.isLoading}
              />
            )}

            {/* Show availability info for patients after selecting doctor */}
            {isPatientLike && targetDoctorId && !availabilitiesQuery.isLoading && (
              <AvailabilityInfo
                isDoctor={isDoctor}
                availableDays={availableDays}
                targetDoctorId={targetDoctorId}
                isLoadingAvailability={availabilitiesQuery.isLoading}
              />
            )}

            {/* Date Selection - Show when we have available days */}
            {targetDoctorId && availableDays.length > 0 && (
              <DateSelection
                register={register}
                errors={errors}
                isLoadingAvailability={availabilitiesQuery.isLoading}
                isSubmitting={isSubmitting}
                availableDays={availableDays}
              />
            )}

            {/* Show message when no availabilities found */}
            {targetDoctorId && 
             !availabilitiesQuery.isLoading && 
             availableDays.length === 0 && (
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <p className="text-sm text-yellow-400">
                  No available days found for this doctor. 
                  Please contact the doctor directly or try another doctor.
                </p>
              </div>
            )}

            {/* Submit Button */}
            {targetDoctorId && availableDays.length > 0 && (
              <SubmitButton
                isLoading={createAppointmentMutation.isLoading}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Disabled submit button when no availability */}
            {targetDoctorId && availableDays.length === 0 && (
              <div className="pt-4 border-t border-gray-700">
                <button
                  type="button"
                  disabled
                  className="w-full px-6 py-3 bg-gray-700 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Cannot Create Appointment (No Availability)
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Info Box */}
        <InfoBox isDoctor={isDoctor} />
      </div>
    </div>
  );
};

export default CreateAppointmentPage;