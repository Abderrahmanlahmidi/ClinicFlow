import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiSearch } from "react-icons/fi";
import CreateUserForm from "../../components/createUserForm";
import UpdateUserForm from "../../components/updateUserForm";
import RoleBadge from "../../components/roleBadge";
import { HandleSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import { getRoles } from "../../apis/rolesApi";
import { getUsers, updateUserRole } from "../../apis/usersApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "../../../../../ui/toasts/toast";
import { useQueryClient } from "@tanstack/react-query";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // get data
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // search hook
  const filteredData = HandleSearch(data?.users, searchTerm);

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

  // handle roles
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const changeUserRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("change role successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });

  const handleChangeRole = (roleId, userId) => {
   
    
    console.log("role id:", roleId);
    console.log("user id:", userId);
   
    changeUserRoleMutation.mutate({
      id: userId,
      roleId: roleId,
    });

  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white mb-2">
              Users Management
            </h1>
            <p className="text-gray-300">
              Manage your clinic users and their roles
            </p>
          </div>
          {/* <button
            onClick={handleCreateClick}
            className="bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium mt-4 sm:mt-0"
          >
            <FiPlus className="w-5 h-5" />
            Create New User
          </button> */}
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Phone
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Current Role
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Change Role
                  </th>
                  {/* <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Actions
                  </th> */}
                </tr>
              </thead>
            </table>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {filteredData?.length > 0 ? (
                    filteredData?.map((user) => (
                      <tr key={user.id} className="border-b border-gray-700">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600">
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
                              <div className="font-medium text-white">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-gray-300">
                          {user.email}
                        </td>

                        <td className="py-4 px-6 text-gray-300">
                          +212 {user.numberPhone}
                        </td>

                        <td className="py-4 px-6">
                          <RoleBadge role={user.roleId.name} />
                        </td>

                        <td className="py-4 px-6">
                          <select
                            onChange={(e) => {
                              handleChangeRole(e.target.value, user?._id);
                            }}
                            value={user?.roleId?._id}
                            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                          >
                            {roles?.roles?.map((role) => {
                              return (
                                <option key={role._id} value={role._id}>
                                  {role.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>

                        {/* <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(user)}
                              className="p-2 text-gray-400 hover:text-lime-400"
                              title="Edit user"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-gray-400 hover:text-red-400"
                              title="Delete user"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-12 px-6 text-center">
                        <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No users found
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No users available in the system"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
