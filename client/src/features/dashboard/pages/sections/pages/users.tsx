import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiSearch } from "react-icons/fi";
import CreateUserForm from "../../components/createUserForm";
import UpdateUserForm from "../../components/updateUserForm";
import RoleBadge from "../../components/roleBadge";
import { HandleSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";


const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    selectedUser,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser,
  } = useHandleForm();

  const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      numberPhone: "1234567890",
      role: "patient",
      imageProfile: "/uploads/profile1.jpg",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      numberPhone: "0987654321",
      role: "doctor",
      imageProfile: "/uploads/profile2.jpg",
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
      numberPhone: "5556667777",
      role: "nurse",
      imageProfile: null,
    },
    {
      id: 4,
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      numberPhone: "4443332222",
      role: "admin",
      imageProfile: "/uploads/profile4.jpg",
    },
  ];

  // search hook
  const filteredData = HandleSearch(users, searchTerm)

  const handleCreateUser = async (userData) => {
    console.log("create user:", userData);
    setShowCreateForm(false);
  };

  const handleUpdateUser = async (userData) => {
    console.log("update user:", userData);
    setShowUpdateForm(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    console.log("delete user:", userId);
  };

  


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Users Management
            </h1>
            <p className="text-gray-600">
              Manage your clinic users and their roles
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 font-normal mt-4 sm:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            Create New User
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="max-h-96 overflow-y-auto">
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user.imageProfile ? (
                              <img
                                src={`http://localhost:8000${user.imageProfile}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUser className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {user.numberPhone}
                      </td>
                      <td className="py-4 px-6">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateClick(user)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Edit user"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete user"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 px-6 text-center text-gray-500"
                    >
                      <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium text-gray-400">
                        No users found
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "No users available"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forms */}
        {showCreateForm && (
          <CreateUserForm
            onClose={handleCloseForms}
            onSubmit={handleCreateUser}
          />
        )}

        {showUpdateForm && (
          <UpdateUserForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateUser}
            user={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
