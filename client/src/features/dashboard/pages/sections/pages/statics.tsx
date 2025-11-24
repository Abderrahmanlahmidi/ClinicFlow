import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '../../services/appointmentApi';
import { getUsers } from "../../services/usersApi";
import { getSpecialities } from "../../services/specialityApi";
import { getAvailabilities } from '../../services/availabilityApi';
import { calculateStats, getChartData } from '../../constants/statisticsUtils';
import { STAT_CARD_CONFIG } from '../../constants/statisticsConstants';
import {
  LoadingSpinner,
  ErrorDisplay,
  StatCard,
  LastRegisteredPatient,
  DoctorSpecialities,
  QuickStats,
  ChartContainer,
  RecentAppointments,
  ProfessionalSummary,
  PatientCareMetrics
} from '../../components/static/StatisticsComponents';

// Import chart config to ensure registration happens
import '../../constants/chartConfig';

export default function Statistics() {
  const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: specialitiesData, isLoading: specialitiesLoading, error: specialitiesError } = useQuery({
    queryKey: ['specialities'],
    queryFn: getSpecialities,
  });

  const { data: availabilitiesData, isLoading: availabilitiesLoading, error: availabilitiesError } = useQuery({
    queryKey: ['availabilities'],
    queryFn: getAvailabilities,
  });

  const isLoading = appointmentsLoading || usersLoading || specialitiesLoading || availabilitiesLoading;
  const error = appointmentsError || usersError || specialitiesError || availabilitiesError;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  const stats = calculateStats(appointmentsData, usersData, specialitiesData, availabilitiesData);
  const { appointmentStatusData, userDistributionData } = getChartData(stats);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Clinic Statistics Dashboard</h1>
          <p className="text-gray-400">Comprehensive overview of clinic performance and patient care</p>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            config={STAT_CARD_CONFIG.patients}
          />
          
          <StatCard
            title="Medical Doctors"
            value={stats.totalDoctors}
            config={STAT_CARD_CONFIG.doctors}
          >
            <div className="mt-2 text-xs text-blue-400">
              {stats.doctorsWithSpecialities} with specialities
            </div>
          </StatCard>

          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            config={STAT_CARD_CONFIG.appointments}
          >
            <div className="mt-2 text-xs text-white">
              {stats.scheduledAppointments} scheduled • {stats.completedAppointments} completed
            </div>
          </StatCard>

          <StatCard
            title="Weekly Slots"
            value={stats.totalWeeklySlots}
            config={STAT_CARD_CONFIG.capacity}
          >
            <div className="mt-2 text-xs text-orange-400">
              {stats.totalDailyCapacity} total capacity
            </div>
          </StatCard>
        </div>

        {/* Second Row - Detailed Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <LastRegisteredPatient patient={stats.lastRegisteredPatient} />
          <DoctorSpecialities distribution={stats.doctorSpecialityDistribution} />
          <QuickStats stats={stats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer title="Appointment Status" data={appointmentStatusData} />
          <ChartContainer title="User Distribution" data={userDistributionData} />
        </div>

        {/* Recent Appointments */}
        <RecentAppointments appointments={stats.recentAppointments} />

        {/* Professional Summary */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfessionalSummary doctors={stats.doctors} />
          <PatientCareMetrics stats={stats} />
        </div> */}
      </div>
    </div>
  );
}