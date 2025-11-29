import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPharmacies,
  deletePharmacy,
  updatePharmacy,
  createPharmacy,
} from "../../services/pharmacyApi";
import { useSearch } from "../../../../../constants/useSearch";
import { useToast } from "../../../../../ui/toasts/toast";
import SearchInput from "../../components/others/SearchBar";
import CreateButton from "../../components/others/CreateButton";
import PageHeader from "../../components/others/PageHeader";
import ConfirmationModal from "../../components/others/ConfirmationModal";
import CreatePharmacyForm from "../../components/forms/pharmacy/CreatePharmacyForm";
import UpdatePharmacyForm from "../../components/forms/pharmacy/UpdatePharmacyForm";


import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiMap,
} from "react-icons/fi";
import { useHandleForm } from "../../../../../constants/handelsConstants";
import ProfessionalMapModal from "../../../../../ui/map/Map";

// Types
interface PharmacyType {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  prescriptionsIds: string[];
}

type Props = {};

const Pharmacy: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [selectedPharmacyForMap, setSelectedPharmacyForMap] = useState<PharmacyType | null>(null);
  const [pharmacyToDelete, setPharmacyToDelete] = useState<PharmacyType | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    selectedUser: selectedPharmacy,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser: setSelectedPharmacy,
  } = useHandleForm();

  // Get pharmacies data
  const {
    data: pharmacies,
    isLoading,
    error,
  } = useQuery<PharmacyType[]>({
    queryKey: ["pharmacies"],
    queryFn: getPharmacies,
  });

  // Search hook
  const filteredPharmacies = useSearch<PharmacyType>(
    pharmacies,
    searchTerm
  ) as PharmacyType[];

  // Create pharmacy mutation
  const createPharmacyMutation = useMutation({
    mutationFn: createPharmacy,
    onSuccess: () => {
      toast.success("Pharmacy created successfully!");
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      setShowCreateForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create pharmacy");
    },
  });

  // Update pharmacy mutation
  const updatePharmacyMutation = useMutation({
    mutationFn: updatePharmacy,
    onSuccess: () => {
      toast.success("Pharmacy updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      setShowUpdateForm(false);
      setSelectedPharmacy(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update pharmacy");
    },
  });

  // Delete pharmacy mutation
  const deletePharmacyMutation = useMutation({
    mutationFn: deletePharmacy,
    onSuccess: () => {
      toast.success("Pharmacy deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["pharmacies"] });
      setDeleteModalOpen(false);
      setPharmacyToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete pharmacy");
    },
  });

  const handleCreatePharmacy = async (
    pharmacyData: Omit<PharmacyType, "_id" | "prescriptionsIds">
  ): Promise<void> => {
    createPharmacyMutation.mutate(pharmacyData);
  };

  const handleUpdatePharmacy = async (
    pharmacyData: Partial<Omit<PharmacyType, "_id" | "prescriptionsIds">>
  ): Promise<void> => {
    if (selectedPharmacy) {
      updatePharmacyMutation.mutate({
        id: selectedPharmacy._id,
        data: pharmacyData,
      });
    }
  };

  const handleDeleteClick = (pharmacy: PharmacyType): void => {
    setPharmacyToDelete(pharmacy);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (pharmacyToDelete) {
      deletePharmacyMutation.mutate(pharmacyToDelete._id);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteModalOpen(false);
    setPharmacyToDelete(null);
  };

  const handleShowMap = (pharmacy: PharmacyType): void => {
    setSelectedPharmacyForMap(pharmacy);
    setMapModalOpen(true);
  };

  const handleCloseMap = (): void => {
    setMapModalOpen(false);
    setSelectedPharmacyForMap(null);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-lg">Loading pharmacies...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error loading pharmacies</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <PageHeader
            title="Pharmacies Management"
            subtitle="Manage pharmacy locations and information"
          />

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search pharmacies by name, address..."
            />

            <CreateButton
              onClick={handleCreateClick}
              isLoading={createPharmacyMutation.status === "pending"}
              loadingText="Creating..."
              normalText="Add New Pharmacy"
            />
          </div>
        </div>

        {/* Pharmacies Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Pharmacy Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Contact Info
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Address
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Opening Hours
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">
                    Location
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
                  {filteredPharmacies && filteredPharmacies.length > 0 ? (
                    filteredPharmacies.map((pharmacy: PharmacyType) => (
                      <tr
                        key={pharmacy._id}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
                      >
                        {/* Pharmacy Name */}
                        <td className="py-4 px-6">
                          <div className="font-medium text-white relative group">
                            <span
                              className="truncate block max-w-[200px]"
                              title={pharmacy.name}
                            >
                              {pharmacy.name}
                            </span>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            {/* Phone Number */}
                            <div className="flex items-center gap-2 text-gray-300">
                              <FiPhone className="w-4 h-4 text-lime-400 flex-shrink-0" />
                              <span
                                className="text-sm truncate block max-w-[150px]"
                                title={pharmacy.phoneNumber}
                              >
                                {pharmacy.phoneNumber}
                              </span>
                            </div>

                            {/* Email Address */}
                            <div className="flex items-center gap-2 text-gray-300">
                              <FiMail className="w-4 h-4 text-lime-400 flex-shrink-0" />
                              <span
                                className="text-sm truncate block max-w-[150px]"
                                title={pharmacy.emailAddress}
                              >
                                {pharmacy.emailAddress}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiMapPin className="w-4 h-4 text-lime-400 flex-shrink-0" />
                            <span
                              className="text-sm truncate block max-w-[200px]"
                              title={pharmacy.address}
                            >
                              {pharmacy.address}
                            </span>
                          </div>
                        </td>

                        {/* Opening Hours */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FiClock className="w-4 h-4 text-lime-400 flex-shrink-0" />
                            <span
                              className="text-sm truncate block max-w-[150px]"
                              title={pharmacy.openingHours}
                            >
                              {pharmacy.openingHours}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="text-gray-300 text-sm">
                              <span
                                className="truncate block max-w-[120px]"
                                title={`${pharmacy.latitude.toFixed(6)}, ${pharmacy.longitude.toFixed(6)}`}
                              >
                                {pharmacy.latitude.toFixed(4)},{" "}
                                {pharmacy.longitude.toFixed(4)}
                              </span>
                            </div>
                           
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(pharmacy)}
                              disabled={
                                updatePharmacyMutation.status === "pending"
                              }
                              className="p-2 text-gray-400 hover:text-lime-400 transition-colors disabled:opacity-50"
                              title="Edit pharmacy"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(pharmacy)}
                              disabled={
                                deletePharmacyMutation.status === "pending"
                              }
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Delete pharmacy"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                             <button
                              onClick={() => handleShowMap(pharmacy)}
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View on map"
                            >
                              <FiMap className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center">
                        <FiMapPin className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          No pharmacies found
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? "Try adjusting your search terms"
                            : "No pharmacies available in the system"}
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
          <CreatePharmacyForm
            onClose={handleCloseForms}
            onSubmit={handleCreatePharmacy}
            isLoading={createPharmacyMutation.status === "pending"}
          />
        )}

        {showUpdateForm && (
          <UpdatePharmacyForm
            onClose={handleCloseForms}
            onSubmit={handleUpdatePharmacy}
            pharmacy={selectedPharmacy}
            isLoading={updatePharmacyMutation.status === "pending"}
          />
        )}

        {/* Google Maps Modal */}
        {mapModalOpen && selectedPharmacyForMap && (
          <ProfessionalMapModal
          longitude={selectedPharmacyForMap.longitude}
          latitude={selectedPharmacyForMap.latitude}
          onClose={handleCloseMap}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Pharmacy"
          message={`Are you sure you want to delete the pharmacy "${pharmacyToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deletePharmacyMutation.status === "pending"}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default Pharmacy;