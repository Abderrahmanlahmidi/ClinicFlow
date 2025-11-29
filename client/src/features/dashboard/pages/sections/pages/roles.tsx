import { useState } from "react";
import { FiShield } from "react-icons/fi";
import CreateRoleForm from "../../components/forms/role/CreateRoleForm.tsx";
import UpdateRoleForm from "../../components/forms/role/UpdateRoleForm.tsx";
import { useSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/rolesApi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import ConfirmationModal from "../../components/others/ConfirmationModal.tsx";
import SearchInput from "../../components/others/SearchBar.tsx";
import CreateButton from "../../components/others/CreateButton.tsx";
import PageHeader from "../../components/others/PageHeader.tsx";
import {
  FiEdit2,
  FiTrash2
} from "react-icons/fi";

// Types
interface Role {
  _id: string;
  id?: string;
  name: string;
  description: string;
}

interface RolesResponse {
  roles: Role[];
}

interface CreateRoleData {
  name: string;
  description: string;
}

interface UpdateRoleData {
  id: string;
  data: Partial<CreateRoleData>;
}

const RolesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    selectedUser: selectedRole,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser: setSelectedRole,
  } = useHandleForm<Role>();

  // Get roles data
  const { data: roles, isLoading: isLoadingRoles } = useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Search hook - using useSearch instead of HandleSearch
  const filteredData = useSearch(roles?.roles, searchTerm);

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Role created successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setShowCreateForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setShowUpdateForm(false);
      setSelectedRole(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setDeleteModalOpen(false);
      setRoleToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });

  const handleCreateRole = async (roleData: CreateRoleData): Promise<void> => {
    createRoleMutation.mutate(roleData);
  };

  const handleUpdateRole = async (roleData: Partial<CreateRoleData>): Promise<void> => {
    if (selectedRole) {
      const updateData: UpdateRoleData = {
        id: selectedRole._id || selectedRole.id || '',
        data: roleData,
      };
      updateRoleMutation.mutate(updateData);
    }
  };

  const handleDeleteClick = (role: Role): void => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete._id);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  if (isLoadingRoles) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Roles Management"
            subtitle="Manage system roles and permissions"
          />

          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search roles by name or description..."
            />

            <CreateButton
              onClick={handleCreateClick}
              isLoading={createRoleMutation.isLoading}
              loadingText="Creating..."
              normalText="Create New Role"
            />
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Role Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <tbody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((role: Role) => (
                      <tr
                        key={role._id}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600">
                              <FiShield className="w-5 h-5 text-lime-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {role.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-gray-300">
                          {role.description}
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(role)}
                              disabled={updateRoleMutation.isLoading}
                              className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                              title="Edit role"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(role)}
                              disabled={deleteRoleMutation.isLoading}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Delete role"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-12 px-6 text-center">
                        <FiShield className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No roles found
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No roles available in the system"}
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
          <CreateRoleForm
            onClose={handleCloseForms}
            onSubmit={handleCreateRole}
            isLoading={createRoleMutation.isLoading}
          />
        )}

        {showUpdateForm && (
          <UpdateRoleForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateRole}
            role={selectedRole}
            isLoading={updateRoleMutation.isLoading}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${roleToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteRoleMutation.isLoading}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default RolesPage;