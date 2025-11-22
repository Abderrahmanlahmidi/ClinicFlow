import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiSearch } from "react-icons/fi";
import CreateRoleForm from "../../components/forms/role/CreateRoleForm.tsx";
import UpdateRoleForm from "../../components/forms/role/UpdateRoleForm.tsx";
import { HandleSearch } from "../../../../../constants/useSearch";
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

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

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
  } = useHandleForm();

  // Get roles data
  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Search hook
  const filteredData = HandleSearch(roles?.roles, searchTerm);

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Role created successfully!");
      queryClient.invalidateQueries(["roles"]);
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries(["roles"]);
      setShowUpdateForm(false);
      setSelectedRole(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully!");
      queryClient.invalidateQueries(["roles"]);
      setDeleteModalOpen(false);
      setRoleToDelete(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });

  const handleCreateRole = async (roleData) => {
    createRoleMutation.mutate(roleData);
  };

  const handleUpdateRole = async (roleData) => {
    if (selectedRole) {
      updateRoleMutation.mutate({
        id: selectedRole.id,
        data: roleData,
      });
    }
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRoleMutation.mutate(roleToDelete._id);
    }
  };

  const handleCancelDelete = () => {
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
          <div className="flex-1">
            <h1 className="text-3xl font-light text-white mb-2">
              Roles Management
            </h1>
            <p className="text-gray-300">Manage system roles and permissions</p>
          </div>
          
          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search roles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
              />
            </div>
            
            <button
              onClick={handleCreateClick}
              disabled={createRoleMutation.isLoading}
              className="bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <FiPlus className="w-5 h-5" />
              {createRoleMutation.isLoading ? "Creating..." : "Create New Role"}
            </button>
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
                  {filteredData?.length > 0 ? (
                    filteredData?.map((role) => (
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
                      <td colSpan="3" className="py-12 px-6 text-center">
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
          />
        )}

        {showUpdateForm && (
          <UpdateRoleForm
            onClose={handleCloseForms}
            onSubmit={handleUpdateRole}
            role={selectedRole}
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