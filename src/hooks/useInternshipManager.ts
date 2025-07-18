import { useState, useEffect } from "react";
import type { InternshipData, EditInternshipForm } from "@/types/internship";
import {
  getInternships,
  createInternship,
  updateInternship,
  deleteInternship,
} from "@/lib/supabase-api";
import { useAuth } from "./useAuth";

export function useInternshipManager() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [selectedInternship, setSelectedInternship] =
    useState<InternshipData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditInternshipForm>({
    company: "",
    position: "",
    totalHours: 0,
    startDate: "",
    endDate: "",
  });
  const [newInternshipForm, setNewInternshipForm] =
    useState<EditInternshipForm>({
      company: "",
      position: "",
      totalHours: 0,
      startDate: "",
      endDate: "",
    });

  // Clear all state when user changes
  const clearState = () => {
    setInternships([]);
    setSelectedInternship(null);
    setIsEditing(false);
    setIsCreatingNew(false);
    setError(null);
    setEditForm({
      company: "",
      position: "",
      totalHours: 0,
      startDate: "",
      endDate: "",
    });
    setNewInternshipForm({
      company: "",
      position: "",
      totalHours: 0,
      startDate: "",
      endDate: "",
    });
  };

  // Load internships when user changes
  useEffect(() => {
    if (user) {
      loadInternships();
    } else {
      // User logged out - clear all state immediately
      clearState();
      setLoading(false);
    }
  }, [user]);

  const loadInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInternships();
      setInternships(data);

      // Auto-select the first internship if available
      if (data.length > 0 && !selectedInternship) {
        setSelectedInternship(data[0]);
      } else if (data.length === 0) {
        setSelectedInternship(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load internships"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateInternshipData = (updatedInternship: InternshipData) => {
    setSelectedInternship(updatedInternship);
    setInternships((prev) =>
      prev.map((internship) =>
        internship.id === updatedInternship.id ? updatedInternship : internship
      )
    );
  };

  const openEditDialog = () => {
    if (!selectedInternship) return;
    setEditForm({
      company: selectedInternship.company,
      position: selectedInternship.position,
      totalHours: selectedInternship.totalHours,
      startDate: selectedInternship.startDate,
      endDate: selectedInternship.endDate,
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (!selectedInternship) return;

    try {
      setError(null);
      const updatedInternship = await updateInternship(selectedInternship.id, {
        company: editForm.company,
        position: editForm.position,
        totalHours: editForm.totalHours,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });

      updateInternshipData(updatedInternship);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update internship"
      );
    }
  };

  const openCreateDialog = () => {
    setNewInternshipForm({
      company: "",
      position: "",
      totalHours: 0,
      startDate: "",
      endDate: "",
    });
    setIsCreatingNew(true);
  };

  const saveNew = async () => {
    try {
      setError(null);
      const newInternship = await createInternship({
        company: newInternshipForm.company,
        position: newInternshipForm.position,
        totalHours: newInternshipForm.totalHours,
        completedHours: 0,
        startDate: newInternshipForm.startDate,
        endDate: newInternshipForm.endDate,
      });

      setInternships((prev) => [newInternship, ...prev]);
      setSelectedInternship(newInternship);
      setIsCreatingNew(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create internship"
      );
    }
  };

  const closeEditDialog = () => setIsEditing(false);
  const closeCreateDialog = () => setIsCreatingNew(false);

  return {
    // State
    internships,
    selectedInternship,
    isEditing,
    isCreatingNew,
    loading,
    error,
    editForm,
    newInternshipForm,

    // Actions
    updateInternship: updateInternshipData,
    openEditDialog,
    saveEdit,
    closeEditDialog,
    openCreateDialog,
    saveNew,
    closeCreateDialog,
    setEditForm,
    setNewInternshipForm,
    loadInternships,
  };
}
