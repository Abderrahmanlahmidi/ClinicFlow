import { CHART_CONFIG } from './chartConfig';

export const calculateStats = (appointmentsData, usersData, specialitiesData, availabilitiesData) => {
  const appointments = appointmentsData?.appointments || [];
  const users = usersData?.users || [];
  const specialities = specialitiesData?.specialities || [];
  const availabilities = availabilitiesData?.availabilities || [];

  // User statistics
  const totalPatients = users.filter(user => user.roleId?.name?.toLowerCase() === 'patient').length;
  const totalDoctors = users.filter(user => user.roleId?.name?.toLowerCase() === 'doctor').length;
  const totalNurses = users.filter(user => user.roleId?.name?.toLowerCase() === 'nurse').length;
  const totalAdmins = users.filter(user => user.roleId?.name?.toLowerCase() === 'admin').length;

  // Appointment statistics
  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(apt => apt.status === 'scheduled').length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'in progress').length;
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;

  // Doctor statistics
  const doctors = users.filter(user => user.roleId?.name?.toLowerCase() === 'doctor');
  const doctorsWithSpecialities = doctors.filter(doctor => doctor.specialityId).length;

  // Availability statistics
  const totalWeeklySlots = availabilities.length;
  const totalDailyCapacity = availabilities.reduce((sum, avail) => sum + (avail.dailyCapacity || 0), 0);

  // Last registered patient
  const patients = users.filter(user => user.roleId?.name?.toLowerCase() === 'patient');
  const lastRegisteredPatient = patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  // Recent appointments (last 5)
  const recentAppointments = appointments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Doctor distribution by speciality
  const doctorSpecialityDistribution = doctors.reduce((acc, doctor) => {
    const speciality = doctor.specialityId?.name || 'No Speciality';
    acc[speciality] = (acc[speciality] || 0) + 1;
    return acc;
  }, {});

  return {
    // User stats
    totalPatients,
    totalDoctors,
    totalNurses,
    totalAdmins,
    totalSpecialities: specialities.length,
    
    // Appointment stats
    totalAppointments,
    scheduledAppointments,
    completedAppointments,
    pendingAppointments,
    cancelledAppointments, // Add this
    
    // Doctor stats
    doctorsWithSpecialities,
    totalWeeklySlots,
    totalDailyCapacity,
    
    // Special data
    lastRegisteredPatient,
    recentAppointments,
    doctorSpecialityDistribution,
    doctors,
    appointments
  };
};

export const getChartData = (stats) => ({
  appointmentStatusData: {
    labels: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.scheduledAppointments, 
          stats.pendingAppointments, 
          stats.completedAppointments, 
          stats.cancelledAppointments || 0 
        ],
        backgroundColor: CHART_CONFIG.colors.appointmentStatus.background,
        borderColor: CHART_CONFIG.colors.appointmentStatus.border,
        borderWidth: 2,
      },
    ],
  },
  userDistributionData: {
    labels: ['Patients', 'Doctors', 'Nurses', 'Admins'],
    datasets: [
      {
        data: [stats.totalPatients, stats.totalDoctors, stats.totalNurses, stats.totalAdmins],
        backgroundColor: CHART_CONFIG.colors.userDistribution.background,
        borderColor: CHART_CONFIG.colors.userDistribution.border,
        borderWidth: 2,
      },
    ],
  }
});