import React from 'react';

const RoleBadge = ({ role }) => {
  const getRoleConfig = (role) => {
    switch (role) {
      case 'Patient':
        return {
          bgColor: 'bg-blue-900/30',
          textColor: 'text-blue-300',
          borderColor: 'border-blue-700'
        };
      case 'Nurse':
        return {
          bgColor: 'bg-green-900/30',
          textColor: 'text-green-300',
          borderColor: 'border-green-700'
        };
      case 'Doctor':
        return {
          bgColor: 'bg-purple-900/30',
          textColor: 'text-purple-300',
          borderColor: 'border-purple-700'
        };
      case 'Admin':
        return {
          bgColor: 'bg-red-900/30',
          textColor: 'text-red-300',
          borderColor: 'border-red-700'
        };
      default:
        return {
          bgColor: 'bg-gray-900/30',
          textColor: 'text-gray-300',
          borderColor: 'border-gray-700'
        };
    }
  };

  const config = getRoleConfig(role);
  const formattedRole = role?.charAt(0).toUpperCase() + role?.slice(1);

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
      `}
    >
      {formattedRole}
    </span>
  );
};

export default RoleBadge;