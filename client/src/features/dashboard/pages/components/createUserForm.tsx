import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiUser, FiMail, FiPhone, FiCamera, FiSave } from 'react-icons/fi';

const CreateUserForm = ({ onClose, onSubmit }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        imageProfile: selectedImage
      };
      await onSubmit(formData);
      reset();
      setImagePreview(null);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setSelectedImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-light text-white">Create New User</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden border-2 border-gray-700 shadow-lg">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <label htmlFor="create-profileImage" className="absolute -bottom-1 -right-1 bg-lime-400 text-gray-900 p-1.5 rounded-full cursor-pointer shadow-lg">
                <FiCamera className="w-3 h-3" />
              </label>
              <input id="create-profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <p className="text-sm text-gray-400 text-center">Upload profile picture</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                {...register("firstName", { required: "First name is required", minLength: { value: 2, message: "First name must be at least 2 characters" } })}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter first name"
              />
            </div>
            {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                {...register("lastName", { required: "Last name is required", minLength: { value: 2, message: "Last name must be at least 2 characters" } })}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter last name"
              />
            </div>
            {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" } })}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter email address"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                {...register("numberPhone", { required: "Phone number is required", pattern: { value: /^[0-9]+$/, message: "Phone number must contain only numbers" }, minLength: { value: 10, message: "Phone number must be at least 10 digits" } })}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
                placeholder="Enter phone number"
              />
            </div>
            {errors.numberPhone && <p className="text-red-400 text-sm mt-1">{errors.numberPhone.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white"
            >
              <option value="">Select a role</option>
              <option value="patient">Patient</option>
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-lime-400 text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
              <FiSave className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
            <button type="button" onClick={handleClose} className="flex-1 border border-gray-600 text-gray-300 py-3 rounded-lg font-normal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;