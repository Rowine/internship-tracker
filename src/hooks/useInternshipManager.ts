import { useState, useEffect } from "react";
import type { InternshipData, EditInternshipForm } from "@/types/internship";
import { generateId } from "@/lib/utils/date";

export function useInternshipManager() {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [selectedInternship, setSelectedInternship] =
    useState<InternshipData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
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

  useEffect(() => {
    // Load internships from localStorage or API
    // For now, start with empty state
    setInternships([]);
    setSelectedInternship(null);
  }, []);

  const updateInternship = (updatedInternship: InternshipData) => {
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

  const saveEdit = () => {
    if (!selectedInternship) return;
    const updatedInternship = {
      ...selectedInternship,
      ...editForm,
    };
    updateInternship(updatedInternship);
    setIsEditing(false);
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

  const saveNew = () => {
    const newInternship: InternshipData = {
      id: generateId(),
      company: newInternshipForm.company,
      position: newInternshipForm.position,
      totalHours: newInternshipForm.totalHours,
      completedHours: 0,
      startDate: newInternshipForm.startDate,
      endDate: newInternshipForm.endDate,
      workDays: new Set(),
      dailyLogs: {},
    };

    setInternships((prev) => [...prev, newInternship]);
    setSelectedInternship(newInternship);
    setIsCreatingNew(false);
  };

  const closeEditDialog = () => setIsEditing(false);
  const closeCreateDialog = () => setIsCreatingNew(false);

  return {
    // State
    internships,
    selectedInternship,
    isEditing,
    isCreatingNew,
    editForm,
    newInternshipForm,

    // Actions
    updateInternship,
    openEditDialog,
    saveEdit,
    closeEditDialog,
    openCreateDialog,
    saveNew,
    closeCreateDialog,
    setEditForm,
    setNewInternshipForm,
  };
}
