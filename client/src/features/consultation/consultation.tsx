import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiFileText, FiPlus } from 'react-icons/fi';


import { useToast } from '../../ui/toasts/toast';
import { getUserConsultations, deleteConsultation, getDoctorConsultations } from '../availability/services/consultationApi';
import { PageHeader } from '../../ui/headers/pageHeader';
import ConfirmationModal from '../dashboard/pages/components/others/ConfirmationModal';

import type { Consultation, FormData } from './Types/index';
import { MOCK_USERS } from './constants';
import {
  getUserFromStorage,
  prepareFormDataForBackend,
  prepareFormDataForFrontend
} from './utils';
import { ConsultationCard } from './components/consultationCard';
import { ConsultationDetailsModal } from './components/ConsultationDetailsModal';
import { EmptyState } from './components/EmptyState';
import ConsultationForm from './components/consultationForm';


export default function ConsultationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [consultationToDelete, setConsultationToDelete] = useState<Consultation | null>(null);

  const toast = useToast();
  const queryClient = useQueryClient();
  const { userId, role, isDoctor, isPatient } = getUserFromStorage();

  const {
    data: consultationsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['consultations', role, userId],
    queryFn: () => {
      if (isDoctor) {
        return getDoctorConsultations(userId!);
      } else if (isPatient) {
        return getUserConsultations(userId!);
      }
      return { success: false, consultations: [] };
    },
    enabled: !!role && !!userId,
  });

  const consultations = consultationsResponse?.consultations || [];

  const deleteMutation = useMutation({
    mutationFn: deleteConsultation,
    onSuccess: () => {
      toast.success("Consultation deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      setConsultationToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete consultation");
    },
  });

  const handleFormSubmit = (formData: FormData) => {
    const backendData = prepareFormDataForBackend(formData);
    console.log('Form submitted with data:', backendData);
    setIsFormOpen(false);
    setEditingConsultation(null);
    toast.success(editingConsultation ? "Consultation updated!" : "Consultation created!");
    refetch();
  };

  const handleEdit = (consultation: Consultation) => {
    const frontendData = prepareFormDataForFrontend(consultation);
    setEditingConsultation(frontendData);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (consultation: Consultation) => {
    setConsultationToDelete(consultation);
  };

  const confirmDelete = () => {
    if (consultationToDelete) {
      deleteMutation.mutate(consultationToDelete._id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConsultation(null);
  };


  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="My Consultations"
          subtitle="Manage patient consultations and medical records"
          icon={<FiFileText className="w-7 h-7 text-lime-400" />}
          buttonText={isDoctor ? "Add Consultation" : ""}
          onButtonClick={isDoctor ? () => setIsFormOpen(true) : undefined}
          buttonIcon={isDoctor ? <FiPlus className="w-5 h-5" /> : undefined}
        />

        {consultations.length === 0 ? (
          <EmptyState
            isDoctor={isDoctor}
            onAddConsultation={() => setIsFormOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {consultations.map((consultation) => (
              <ConsultationCard
                key={consultation._id}
                consultation={consultation}
                isDoctor={isDoctor}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewDetails={setSelectedConsultation}
              />
            ))}
          </div>
        )}

        {isFormOpen && (
          <ConsultationForm
            onSubmit={handleFormSubmit}
            isLoading={false}
            isEditing={!!editingConsultation}
            onClose={handleCloseForm}
            users={MOCK_USERS}
            initialData={editingConsultation}
          />
        )}

        {selectedConsultation && (
          <ConsultationDetailsModal
            consultation={selectedConsultation}
            isDoctor={isDoctor}
            onClose={() => setSelectedConsultation(null)}
          />
        )}

        <ConfirmationModal
          isOpen={!!consultationToDelete}
          onClose={() => setConsultationToDelete(null)}
          onConfirm={confirmDelete}
          title="Delete Consultation"
          message={`Are you sure you want to delete this consultation? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={deleteMutation.isLoading}
          variant="danger"
        />
      </div>
    </div>
  );
}