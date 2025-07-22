import { useState, useEffect } from "react";
import type { InternshipData, WorkLogForm } from "@/types/internship";
import { formatDateKey } from "@/lib/utils/date";
import {
  updateWorkLog,
  deleteWorkLog,
  recalculateCompletedHours,
} from "@/lib/supabase-api";
import { useAuth } from "./useAuth";

export function useWorkLogManager() {
  const { user } = useAuth();
  const [isLoggingWork, setIsLoggingWork] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workLogForm, setWorkLogForm] = useState<WorkLogForm>({
    hours: 0,
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Clear all state when user changes
  const clearState = () => {
    setIsLoggingWork(false);
    setSelectedDate(null);
    setWorkLogForm({
      hours: 0,
      notes: "",
    });
    setError(null);
  };

  // Clear state when user changes
  useEffect(() => {
    if (!user) {
      clearState();
    }
  }, [user]);

  const openWorkLogDialog = (date: Date, internship: InternshipData) => {
    const dateKey = formatDateKey(date);
    const existingLog = internship.dailyLogs[dateKey];

    setSelectedDate(date);
    setWorkLogForm({
      hours: existingLog?.hours || 0,
      notes: existingLog?.notes || "",
    });
    setIsLoggingWork(true);
    setError(null);
  };

  const saveWorkLog = async (
    internship: InternshipData,
    onUpdate: (updatedInternship: InternshipData) => void
  ) => {
    if (!selectedDate) return;

    try {
      setError(null);
      const dateKey = formatDateKey(selectedDate);

      // Update or create work log in Supabase
      await updateWorkLog(
        internship.id,
        dateKey,
        workLogForm.hours,
        workLogForm.notes
      );

      // Recalculate completed hours
      const newCompletedHours = await recalculateCompletedHours(internship.id);

      // Update local state
      const updatedDailyLogs = {
        ...internship.dailyLogs,
        [dateKey]: {
          hours: workLogForm.hours,
          notes: workLogForm.notes,
        },
      };

      const newWorkDays = new Set(internship.workDays);
      if (workLogForm.hours > 0) {
        newWorkDays.add(dateKey);
      } else {
        newWorkDays.delete(dateKey);
        // Remove from daily logs if hours is 0
        delete updatedDailyLogs[dateKey];
      }

      const updatedInternship = {
        ...internship,
        workDays: newWorkDays,
        dailyLogs: updatedDailyLogs,
        completedHours: newCompletedHours,
      };

      onUpdate(updatedInternship);
      closeWorkLogDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save work log");
    }
  };

  const deleteWorkLogEntry = async (
    internship: InternshipData,
    onUpdate: (updatedInternship: InternshipData) => void
  ) => {
    if (!selectedDate) return;

    try {
      setError(null);
      const dateKey = formatDateKey(selectedDate);

      // Delete work log from Supabase
      await deleteWorkLog(internship.id, dateKey);

      // Recalculate completed hours
      const newCompletedHours = await recalculateCompletedHours(internship.id);

      // Update local state
      const updatedDailyLogs = { ...internship.dailyLogs };
      delete updatedDailyLogs[dateKey];

      const newWorkDays = new Set(internship.workDays);
      newWorkDays.delete(dateKey);

      const updatedInternship = {
        ...internship,
        workDays: newWorkDays,
        dailyLogs: updatedDailyLogs,
        completedHours: newCompletedHours,
      };

      onUpdate(updatedInternship);
      closeWorkLogDialog();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete work log"
      );
    }
  };

  const closeWorkLogDialog = () => {
    setIsLoggingWork(false);
    setSelectedDate(null);
    setError(null);
  };

  const hasExistingLog = (internship: InternshipData | null): boolean => {
    return !!(
      selectedDate && internship?.dailyLogs[formatDateKey(selectedDate)]
    );
  };

  return {
    // State
    isLoggingWork,
    selectedDate,
    workLogForm,
    error,

    // Actions
    openWorkLogDialog,
    saveWorkLog,
    deleteWorkLog: deleteWorkLogEntry,
    closeWorkLogDialog,
    hasExistingLog,
    setWorkLogForm,
  };
}
