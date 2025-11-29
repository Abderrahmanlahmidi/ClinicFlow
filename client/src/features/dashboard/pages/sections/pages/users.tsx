import { useState } from "react";
import { FiUser } from "react-icons/fi";
import CreateUserForm from "../../components/forms/user/CreateUserForm.tsx";
import UpdateUserForm from "../../components/forms/user/UpdateUserForm.tsx";
import RoleBadge from "../../components/others/RoleBadge.tsx";
import { useSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import { getRoles } from "../../services/rolesApi";
import { getUsers, updateUserRole, updateUserSpeciality } from "../../services/usersApi";
import { getSpecialities } from "../../services/specialityApi.tsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import { useQueryClient } from "@tanstack/react-query";
import SearchInput from "../../components/others/SearchBar.tsx";
import PageHeader from "../../components/others/PageHeader.tsx";

// Types
interface Role {
  _id: string;
  name: string;
}

interface Speciality {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  numberPhone: string;
  imageProfile?: string;
  roleId?: Role;
  specialityId?: string;
}

interface UsersResponse {
  users: User[];
}

interface RolesResponse {
  roles: Role[];
}

interface SpecialitiesResponse {
  specialities: Speciality[];
}

interface UpdateRoleData {
  id: string;
  roleId: string;
}

interface UpdateSpecialityData {
  userId: string;
  specialityId: string;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
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
  } = useHandleForm<User>();

  const { data, error, isError, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: roles } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: specialities } = useQuery<SpecialitiesResponse>({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
  });

  // Search hook - using useSearch instead of HandleSearch
  const filteredData = useSearch(data?.users, searchTerm);

  const handleCreateUser = async (userData: any): Promise<void> => {
    console.log("create user:", userData);
    setShowCreateForm(false);
  };

  const handleUpdateUser = async (userData: any): Promise<void> => {
    console.log("update user:", userData);
    setShowUpdateForm(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    console.log("delete user:", userId);
  };

  // Change user role mutation
  const changeUserRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role",
      );
    },
  });

  // Change user speciality mutation
  const changeUserSpecialityMutation = useMutation({
    mutationFn: updateUserSpeciality,
    onSuccess: () => {
      toast.success("User speciality updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user speciality",
      );
    },
  });

  const handleChangeRole = (roleId: string, userId: string): void => {
    const updateData: UpdateRoleData = {
      id: userId,
      roleId: roleId,
    };
    changeUserRoleMutation.mutate(updateData);
  };

  const handleChangeSpeciality = (specialityId: string, userId: string): void => {
    console.log("check mutation user id:", userId);
    const updateData: UpdateSpecialityData = {
      userId: userId,
      specialityId: specialityId,
    };
    changeUserSpecialityMutation.mutate(updateData);
  };

  const isDoctor = (user: User): boolean => {
    return user.roleId?.name?.toLowerCase() === 'doctor';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Users Management"
            subtitle="Manage your clinic users and their roles"
          />

          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search users by name, email, or role..."
            />
            
            {/* Uncomment if you want the create button */}
            {/* <CreateButton
              onClick={handleCreateClick}
              normalText="Create New User"
            /> */}
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Speciality
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((user: User) => (
                      <tr key={user._id || user.id} className="border-b border-gray-700">
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
                          <RoleBadge role={user?.roleId?.name} />
                        </td>

                        <td className="py-4 px-6">
                          <select
                            onChange={(e) => {
                              handleChangeRole(e.target.value, user._id || user.id || '');
                            }}
                            value={user?.roleId?._id || ''}
                            disabled={changeUserRoleMutation.isLoading}
                            className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {roles?.roles?.map((role: Role) => {
                              return (
                                <option key={role._id} value={role._id}>
                                  {role.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>

                        {/* Speciality Select - Only show for doctors */}
                        <td className="py-4 px-6">
                          {isDoctor(user) ? (
                            <select
                              onChange={(e) => {
                                handleChangeSpeciality(e.target.value, user._id || user.id || '');
                              }}
                              value={user?.specialityId || ''}
                              disabled={changeUserSpecialityMutation.isLoading}
                              className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-lime-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="">Select Speciality</option>
                              {specialities?.specialities?.map((speciality: Speciality) => {
                                return (
                                  <option key={speciality._id} value={speciality._id}>
                                    {speciality.name}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <span className="text-gray-500 text-sm">Not applicable</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center">
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