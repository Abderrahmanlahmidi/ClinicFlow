import React from 'react';
import { FiUsers, FiCalendar, FiTrendingUp, FiStar, FiUser, FiClock } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { CHART_CONFIG } from '../../constants/chartConfig';
import { getStatusColor } from '../../constants/statusAppointmentColor';

// Icon mapping
const iconMap = {
  users: FiUsers,
  user: FiUser,
  calendar: FiCalendar,
  'trending-up': FiTrendingUp,
  star: FiStar,
  clock: FiClock,
};

// Loading Component
export const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-white text-lg">Loading statistics...</div>
    </div>
  </div> 
);

// Error Component
export const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-400 text-xl mb-4">Failed to load data</div>
      <div className="text-gray-400 mb-4 max-w-md">
        {error?.message || 'Unable to fetch statistics data. Please try again.'}
      </div>
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Stat Card Component
export const StatCard = ({ title, value, config, children }) => {
  const IconComponent = iconMap[config.icon];
  
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${config.bgColor}`}>
          <IconComponent className={`w-6 h-6 text-white`} />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {children}
    </div>
  );
};

// Last Registered Patient Component
export const LastRegisteredPatient = ({ patient }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <FiUser className="w-5 h-5 text-lime-400" />
      Last Registered Patient
    </h3>
    {patient ? (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600 overflow-hidden">
            {patient.imageProfile ? (
              <img
                src={`http://localhost:8000${patient.imageProfile}`}
                alt={`${patient.firstName} ${patient.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-white">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="text-sm text-gray-400">
              {patient.email}
            </div>
            <div className="text-xs text-lime-400">
              Joined {new Date(patient.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <p className="text-gray-400 text-sm">No patients registered yet</p>
    )}
  </div>
);

// Doctor Specialities Component
export const DoctorSpecialities = ({ distribution }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <FiStar className="w-5 h-5 text-blue-400" />
      Doctor Specialities
    </h3>
    <div className="space-y-2">
      {Object.entries(distribution).map(([speciality, count]) => (
        <div key={speciality} className="flex justify-between items-center">
          <span className="text-gray-300 text-sm">{speciality}</span>
          <span className="text-blue-400 font-medium">{count}</span>
        </div>
      ))}
    </div>
  </div>
);

// Quick Stats Component
export const QuickStats = ({ stats }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <FiTrendingUp className="w-5 h-5 text-green-400" />
      Clinic Overview
    </h3>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-400 text-sm">Medical Staff</span>
        <span className="text-white font-medium">
          {stats.totalDoctors + stats.totalNurses} professionals
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400 text-sm">Specialities</span>
        <span className="text-white font-medium">{stats.totalSpecialities}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400 text-sm">Appointment Rate</span>
        <span className="text-green-400 font-medium">
          {stats.totalAppointments > 0 ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) : 0}%
        </span>
      </div>
    </div>
  </div>
);

// Chart Component
export const ChartContainer = ({ title, data }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
    <div className="h-64">
      <Doughnut data={data} options={CHART_CONFIG.options} />
    </div>
  </div>
);

// Recent Appointments Component
export const RecentAppointments = ({ appointments }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <FiClock className="w-5 h-5 text-lime-400" />
      Recent Appointments
    </h3>
    <div className="space-y-3">
      {appointments.length > 0 ? (
        appointments.map((appointment, index) => (
          <div key={appointment._id || index} className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-lime-400 flex items-center justify-center">
                <span className="text-lime-400 text-sm font-medium">{index + 1}</span>
              </div>
              <div className="space-y-1">
                <div className="text-white text-sm font-medium">
                  {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                </div>
                <div className="text-gray-400 text-xs">
                  with Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                </div>
                <div className="text-gray-400 text-xs">
                  {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-lime-400 bg-gray-800 text-white ${
                getStatusColor(appointment.status)
              }`}>
                {appointment.status}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm text-center py-4">No recent appointments</p>
      )}
    </div>
  </div>
);
// Professional Summary Component
export const ProfessionalSummary = ({ doctors }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">Medical Team Summary</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Cardiologists</span>
        <span className="text-red-400 font-medium">
          {doctors.filter(d => d.specialityId?.name === 'Cardiology').length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Neurologists</span>
        <span className="text-blue-400 font-medium">
          {doctors.filter(d => d.specialityId?.name === 'Neurologist').length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Ophthalmologists</span>
        <span className="text-green-400 font-medium">
          {doctors.filter(d => d.specialityId?.name === 'Ophthalmologist').length}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Endocrinologists</span>
        <span className="text-purple-400 font-medium">
          {doctors.filter(d => d.specialityId?.name === 'Endocrinologist').length}
        </span>
      </div>
    </div>
  </div>
);

// Patient Care Metrics Component
export const PatientCareMetrics = ({ stats }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">Patient Care Metrics</h3>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Avg. Appointments per Patient</span>
        <span className="text-lime-400 font-medium">
          {stats.totalPatients > 0 ? (stats.totalAppointments / stats.totalPatients).toFixed(1) : '0'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Patient to Doctor Ratio</span>
        <span className="text-blue-400 font-medium">
          {stats.totalDoctors > 0 ? (stats.totalPatients / stats.totalDoctors).toFixed(1) : 'N/A'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Weekly Capacity Utilization</span>
        <span className="text-orange-400 font-medium">
          {stats.totalWeeklySlots > 0 ? Math.round((stats.totalAppointments / stats.totalDailyCapacity) * 100) : 0}%
        </span>
      </div>
    </div>
  </div>
);