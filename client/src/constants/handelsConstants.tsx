import { useState } from "react";

export function useHandleForm() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const handleCreateClick = () => {
    setShowCreateForm(true);
    setShowUpdateForm(false);
    setSelectedUser(null);
  };

  const handleUpdateClick = (element) => {
    setSelectedUser(element);
    setShowUpdateForm(true);
    setShowCreateForm(false);
  };

  const handleCloseForms = () => {
    setShowCreateForm(false);
    setShowUpdateForm(false);
    setSelectedUser(null);
  };

  return {
    selectedUser,
    showCreateForm,
    showUpdateForm,
    handleCreateClick,
    handleUpdateClick,
    handleCloseForms,
    setShowCreateForm,
    setShowUpdateForm,
    setSelectedUser
  };
}
