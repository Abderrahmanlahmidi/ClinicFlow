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
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const CHART_CONFIG = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
        }
      },
    },
  },
  colors: {
    appointmentStatus: {
      background: [
        'rgb(59, 130, 246)', // blue-500 - scheduled
        'rgb(234, 179, 8)',  // yellow-500 - in progress
        'rgb(34, 197, 94)',  // green-500 - completed
        'rgb(239, 68, 68)'   // red-500 - cancelled
      ],
      border: [
        'rgb(59, 130, 246)', // blue-500 - scheduled
        'rgb(234, 179, 8)',  // yellow-500 - in progress
        'rgb(34, 197, 94)',  // green-500 - completed
        'rgb(239, 68, 68)'   // red-500 - cancelled
      ]
    },
    userDistribution: {
      background: [
        'rgb(30, 58, 138)',  // blue-900 - Patient
        'rgb(126, 34, 206)', // purple-700 - Nurse
        'rgb(34, 197, 94)',  // green-500 - Doctor
        'rgb(185, 28, 28)'   // red-700 - Admin
      ],
      border: [
        'rgb(59, 130, 246)', // blue-500 - Patient
        'rgb(168, 85, 247)', // purple-500 - Nurse
        'rgb(34, 197, 94)',  // green-500 - Doctor
        'rgb(239, 68, 68)'   // red-500 - Admin
      ]
    }
  }
};