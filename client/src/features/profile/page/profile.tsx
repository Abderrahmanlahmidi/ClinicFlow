import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../api/axiosInstance';
import ProfileUpdateForm from '../components/updatForm';
import PasswordChangeForm from '../components/passwordForm';
import { FiUser } from 'react-icons/fi';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    imageProfile: '',
    numberPhone: ''
  });
  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get(`/user/${userId}`);
        setUserData(response.data.user);

        console.log(response)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserInfo();
  }, [userId]);

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Profile Settings</h1>
          <p className="text-lg text-gray-600">Manage your account information and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto overflow-hidden border-4 border-white shadow-lg">
                  {userData.imageProfile ? (
                    <img
                      src={`http://localhost:8000${userData.imageProfile}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              
              <h2 className="text-xl font-normal text-gray-900 mb-2">
                {userData.firstName} {userData.lastName}
              </h2>
              <p className="text-gray-600 mb-2">{userData.email}</p>
              <p className="text-gray-500 text-sm">{`${userData.roleId.name} since 2024`}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-normal text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900 font-medium">2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Appointments</span>
                  <span className="text-gray-900 font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ProfileUpdateForm 
              userData={userData} 
              onProfileUpdate={handleProfileUpdate} 
            />
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </div>
  );
}