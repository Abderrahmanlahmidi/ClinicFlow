import { useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBriefcase,
} from "react-icons/fi";
import CreateSpecialityForm from "../../components/forms/speciality/CreateSpecialityForm.tsx";
import UpdateSpecialityForm from "../../components/forms/speciality/UpdateSpecialityForm.tsx";
import { HandleSearch } from "../../../../../constants/useSearch";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import {
  getSpecialities,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
} from "../../services/specialityApi";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "../../../../../ui/toasts/toast";
import ConfirmationModal from "../../components/others/ConfirmationModal.tsx";

const SpecialityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [specialityToDelete, setSpecialityToDelete] = useState(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    selectedUser: selectedSpeciality,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser: setSelectedSpeciality,
  } = useHandleForm();

  // Get specialities data
  const { data: specialities, isLoading: isLoadingSpecialities } = useQuery({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
  });

  console.log(specialities);

  // Search hook
  const filteredData = HandleSearch(specialities?.specialities, searchTerm);

  // Create speciality mutation
  const createSpecialityMutation = useMutation({
    mutationFn: createSpeciality,
    onSuccess: () => {
      toast.success("Speciality created successfully!");
      queryClient.invalidateQueries(["specialities"]);
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create speciality",
      );
    },
  });

  // Update speciality mutation
  const updateSpecialityMutation = useMutation({
    mutationFn: updateSpeciality,
    onSuccess: () => {
      toast.success("Speciality updated successfully!");
      queryClient.invalidateQueries(["specialities"]);
      setShowUpdateForm(false);
      setSelectedSpeciality(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update speciality",
      );
    },
  });

  // Delete speciality mutation
  const deleteSpecialityMutation = useMutation({
    mutationFn: deleteSpeciality,
    onSuccess: () => {
      toast.success("Speciality deleted successfully!");
      queryClient.invalidateQueries(["specialities"]);
      setDeleteModalOpen(false);
      setSpecialityToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete speciality",
      );
    },
  });

  const handleCreateSpeciality = async (specialityData) => {
    createSpecialityMutation.mutate(specialityData);
  };

  const handleUpdateSpeciality = async (specialityData) => {
    if (selectedSpeciality) {
      updateSpecialityMutation.mutate({
        id: selectedSpeciality._id,
        data: specialityData,
      });
    }
  };

  const handleDeleteClick = (speciality) => {
    setSpecialityToDelete(speciality);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (specialityToDelete) {
      deleteSpecialityMutation.mutate(specialityToDelete._id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSpecialityToDelete(null);
  };

  return (
<div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-light text-white mb-2">
          Specialities Management
        </h1>
        <p className="text-gray-300">Manage medical specialities</p>
      </div>
      
      {/* Search Bar - Moved to header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search specialities by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent bg-gray-900 text-white placeholder-gray-400"
          />
        </div>
        
        <button
          onClick={handleCreateClick}
          disabled={createSpecialityMutation.isLoading}
          className="bg-lime-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 font-medium hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <FiPlus className="w-5 h-5" />
          {createSpecialityMutation.isLoading
            ? "Creating..."
            : "Create New Speciality"}
        </button>
      </div>
    </div>

    {/* Specialities Table */}
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                Speciality Name
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
                filteredData?.map((speciality) => (
                  <tr
                    key={speciality._id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600">
                          <FiBriefcase className="w-5 h-5 text-lime-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {speciality.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-300">
                      {speciality.description}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateClick(speciality)}
                          disabled={updateSpecialityMutation.isLoading}
                          className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                          title="Edit speciality"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(speciality)}
                          disabled={deleteSpecialityMutation.isLoading}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete speciality"
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
                    <FiBriefcase className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium text-gray-400 mb-2">
                      No specialities found
                    </p>
                    <p className="text-sm text-gray-500">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "No specialities available in the system"}
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
      <CreateSpecialityForm
        onClose={handleCloseForms}
        onSubmit={handleCreateSpeciality}
        isLoading={createSpecialityMutation.isLoading}
      />
    )}

    {showUpdateForm && (
      <UpdateSpecialityForm
        onClose={handleCloseForms}
        onSubmit={handleUpdateSpeciality}
        speciality={selectedSpeciality}
        isLoading={updateSpecialityMutation.isLoading}
      />
    )}

    {/* Delete Confirmation Modal */}
    <ConfirmationModal
      isOpen={deleteModalOpen}
      onClose={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Delete Speciality"
      message={`Are you sure you want to delete the speciality "${specialityToDelete?.name}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      isLoading={deleteSpecialityMutation.isLoading}
      variant="danger"
    />
  </div>
</div>
  );
};

export default SpecialityPage;
