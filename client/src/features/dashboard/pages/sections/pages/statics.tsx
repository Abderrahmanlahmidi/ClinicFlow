import React from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiStar } from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '../../services/appointmentApi';
import { getUsers } from "../../services/usersApi";
import { getSpecialities } from "../../services/specialityApi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Statistics() {
  // Fetch real data from APIs
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: specialitiesData, isLoading: specialitiesLoading } = useQuery({
    queryKey: ['specialities'],
    queryFn: getSpecialities,
  });

  const isLoading = appointmentsLoading || usersLoading || specialitiesLoading;

  // Process real data for charts
  const processAppointmentsData = () => {
    if (!appointmentsData?.appointments) return [];
    
    const monthlyCounts = Array(12).fill(0);
    appointmentsData.appointments.forEach(appointment => {
      const date = new Date(appointment.createdAt || appointment.date);
      const month = date.getMonth();
      monthlyCounts[month]++;
    });
    
    return monthlyCounts;
  };

  const processRevenueData = () => {
    if (!appointmentsData?.appointments) return [];
    
    const monthlyRevenue = Array(12).fill(0);
    appointmentsData.appointments.forEach(appointment => {
      if (appointment.status === 'completed' && appointment.fee) {
        const date = new Date(appointment.createdAt || appointment.date);
        const month = date.getMonth();
        monthlyRevenue[month] += appointment.fee;
      }
    });
    
    return monthlyRevenue;
  };

  // Calculate statistics from real data
  const calculateStats = () => {
    const appointments = appointmentsData?.appointments || [];
    const users = usersData?.users || [];
    const specialities = specialitiesData?.specialities || [];

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const totalPatients = users.filter(user => user.roleId?.name === 'patient' || user.roleId?.name === 'Patient').length;
    const totalDoctors = users.filter(user => user.roleId?.name === 'doctor' || user.roleId?.name === 'Doctor').length;
    const totalSpecialities = specialities.length;
    
    // Calculate monthly revenue
    const monthlyRevenue = processRevenueData();
    const totalRevenue = monthlyRevenue.reduce((sum, revenue) => sum + revenue, 0);

    return {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalPatients,
      totalDoctors,
      totalSpecialities,
      totalRevenue,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
    };
  };

  const stats = calculateStats();
  const monthlyAppointments = processAppointmentsData();
  const monthlyRevenue = processRevenueData();

  // Chart options with gray-900 background
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9CA3AF'
        },
        backgroundColor: '#111827' // gray-900
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9CA3AF'
        },
        backgroundColor: '#111827' // gray-900
      }
    },
    backgroundColor: '#111827' // gray-900
  };

  // Custom plugin to set chart background to gray-900
  const backgroundPlugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#111827'; // gray-900
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

  // Appointments Chart Data
  const appointmentsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Appointments',
        data: monthlyAppointments,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Revenue Chart Data
  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: monthlyRevenue,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Clinic Statistics</h1>
          <p className="text-gray-400">Real-time data from your clinic management system</p>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500 bg-opacity-10">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm text-green-400">
                <FiTrendingUp className="w-4 h-4 text-green-400" />
                <span>+{Math.round(stats.completionRate)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalAppointments}</h3>
            <p className="text-gray-400 text-sm">Total Appointments</p>
            <div className="mt-2 text-xs text-white">
              {stats.completedAppointments} completed • {stats.pendingAppointments} pending
            </div>
          </div>

          {/* Total Patients */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500 bg-opacity-10">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalPatients}</h3>
            <p className="text-gray-400 text-sm">Total Patients</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500 bg-opacity-10">
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>

          {/* Doctors & Specialities */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-500 bg-opacity-10">
                <FiStar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalDoctors}</h3>
            <p className="text-gray-400 text-sm">Doctors • {stats.totalSpecialities} Specialities</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <FiCalendar className="w-5 h-5 text-lime-400" />
              <h3 className="text-lg font-semibold text-white">Monthly Appointments</h3>
            </div>
            <div className="h-80 bg-gray-900 rounded-lg">
              <Bar 
                data={appointmentsChartData} 
                options={chartOptions}
                plugins={[backgroundPlugin]}
              />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <FiDollarSign className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Monthly Revenue</h3>
            </div>
            <div className="h-80 bg-gray-900 rounded-lg">
              <Line 
                data={revenueChartData} 
                options={chartOptions}
                plugins={[backgroundPlugin]}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-lime-400 mb-1">{stats.completedAppointments}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.pendingAppointments}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.totalDoctors}</div>
            <div className="text-sm text-gray-400">Doctors</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.totalSpecialities}</div>
            <div className="text-sm text-gray-400">Specialities</div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-gray-300">
              <p className="mb-2">• Appointment completion rate: <span className="text-lime-400 font-medium">{stats.completionRate.toFixed(1)}%</span></p>
              <p className="mb-2">• Average monthly appointments: <span className="text-lime-400 font-medium">{Math.round(stats.totalAppointments / 12)}</span></p>
              <p>• Total patients in system: <span className="text-lime-400 font-medium">{stats.totalPatients}</span></p>
            </div>
            <div className="text-gray-300">
              <p className="mb-2">• Patient to doctor ratio: <span className="text-lime-400 font-medium">{stats.totalDoctors > 0 ? (stats.totalPatients / stats.totalDoctors).toFixed(1) : 'N/A'}</span></p>
              <p className="mb-2">• Revenue per appointment: <span className="text-lime-400 font-medium">${stats.totalAppointments > 0 ? (stats.totalRevenue / stats.totalAppointments).toFixed(0) : '0'}</span></p>
              <p>• Available specialities: <span className="text-lime-400 font-medium">{stats.totalSpecialities}</span></p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h4 className="text-md font-semibold text-white mb-3">Appointment Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Completed</span>
                <span className="text-lime-400 font-medium">{stats.completedAppointments}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pending</span>
                <span className="text-yellow-400 font-medium">{stats.pendingAppointments}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cancelled</span>
                <span className="text-red-400 font-medium">{stats.totalAppointments - stats.completedAppointments - stats.pendingAppointments}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h4 className="text-md font-semibold text-white mb-3">Staff Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Doctors</span>
                <span className="text-blue-400 font-medium">{stats.totalDoctors}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Patients</span>
                <span className="text-purple-400 font-medium">{stats.totalPatients}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Specialities</span>
                <span className="text-orange-400 font-medium">{stats.totalSpecialities}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h4 className="text-md font-semibold text-white mb-3">Financial Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Revenue</span>
                <span className="text-green-400 font-medium">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Revenue/Month</span>
                <span className="text-green-400 font-medium">${Math.round(stats.totalRevenue / 12).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-lime-400 font-medium">{stats.completionRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}