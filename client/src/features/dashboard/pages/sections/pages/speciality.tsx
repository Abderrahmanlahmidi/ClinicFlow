import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiBriefcase,
} from "react-icons/fi";
import CreateSpecialityForm from "../../components/forms/speciality/CreateSpecialityForm.tsx";
import UpdateSpecialityForm from "../../components/forms/speciality/UpdateSpecialityForm.tsx";
import { useSearch } from "../../../../../constants/useSearch";
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
import SearchInput from "../../components/others/SearchBar.tsx";
import CreateButton from "../../components/others/CreateButton.tsx";
import PageHeader from "../../components/others/PageHeader.tsx";

// Types
interface Speciality {
  _id: string;
  name: string;
  description: string;
}

interface SpecialitiesResponse {
  specialities: Speciality[];
}

interface CreateSpecialityData {
  name: string;
  description: string;
}

interface UpdateSpecialityData {
  id: string;
  data: Partial<CreateSpecialityData>;
}

const SpecialityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [specialityToDelete, setSpecialityToDelete] = useState<Speciality | null>(null);

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
  } = useHandleForm<Speciality>();

  // Get specialities data
  const { data: specialities, isLoading: isLoadingSpecialities } = useQuery<SpecialitiesResponse>({
    queryKey: ["specialities"],
    queryFn: getSpecialities,
  });

  console.log(specialities);

  // Search hook
  const filteredSpecialities= useSearch(specialities?.specialities, searchTerm);

  // Create speciality mutation
  const createSpecialityMutation = useMutation({
    mutationFn: createSpeciality,
    onSuccess: () => {
      toast.success("Speciality created successfully!");
      queryClient.invalidateQueries({ queryKey: ["specialities"] });
      setShowCreateForm(false);
    },
    onError: (error: any) => {
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
      queryClient.invalidateQueries({ queryKey: ["specialities"] });
      setShowUpdateForm(false);
      setSelectedSpeciality(null);
    },
    onError: (error: any) => {
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
      queryClient.invalidateQueries({ queryKey: ["specialities"] });
      setDeleteModalOpen(false);
      setSpecialityToDelete(null);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete speciality",
      );
    },
  });

  const handleCreateSpeciality = async (specialityData: CreateSpecialityData): Promise<void> => {
    createSpecialityMutation.mutate(specialityData);
  };

  const handleUpdateSpeciality = async (specialityData: Partial<CreateSpecialityData>): Promise<void> => {
    if (selectedSpeciality) {
      const updateData: UpdateSpecialityData = {
        id: selectedSpeciality._id,
        data: specialityData,
      };
      updateSpecialityMutation.mutate(updateData);
    }
  };

  const handleDeleteClick = (speciality: Speciality): void => {
    setSpecialityToDelete(speciality);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (specialityToDelete) {
      deleteSpecialityMutation.mutate(specialityToDelete._id);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setSpecialityToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Specialities Management"
            subtitle="Manage medical specialities"
          />

          {/* Search Bar - Moved to header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search specialities by name or description..."
            />

            <CreateButton
              onClick={handleCreateClick}
              isLoading={createSpecialityMutation.isLoading}
              loadingText="Creating..."
              normalText="Create New Speciality"
            />
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
                  {filteredSpecialities && filteredSpecialities.length > 0 ? (
                    filteredSpecialities.map((speciality: Speciality) => (
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
                      <td colSpan={3} className="py-12 px-6 text-center">
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