import { useState } from "react";
import type { InternshipData, WorkLogForm } from "@/types/internship";
import { formatDateKey } from "@/lib/utils/date";

export function useWorkLogManager() {
  const [isLoggingWork, setIsLoggingWork] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workLogForm, setWorkLogForm] = useState<WorkLogForm>({
    hours: 0,
    notes: "",
  });

  const openWorkLogDialog = (date: Date, internship: InternshipData) => {
    const dateKey = formatDateKey(date);
    const existingLog = internship.dailyLogs[dateKey];

    setSelectedDate(date);
    setWorkLogForm({
      hours: existingLog?.hours || 0,
      notes: existingLog?.notes || "",
    });
    setIsLoggingWork(true);
  };

  const saveWorkLog = (
    internship: InternshipData,
    onUpdate: (updatedInternship: InternshipData) => void
  ) => {
    if (!selectedDate) return;

    const dateKey = formatDateKey(selectedDate);
    const previousLog = internship.dailyLogs[dateKey];
    const previousHours = previousLog?.hours || 0;

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
    }

    const newCompletedHours =
      internship.completedHours - previousHours + workLogForm.hours;

    const updatedInternship = {
      ...internship,
      workDays: newWorkDays,
      dailyLogs: updatedDailyLogs,
      completedHours: Math.max(0, newCompletedHours),
    };

    onUpdate(updatedInternship);
    closeWorkLogDialog();
  };

  const deleteWorkLog = (
    internship: InternshipData,
    onUpdate: (updatedInternship: InternshipData) => void
  ) => {
    if (!selectedDate) return;

    const dateKey = formatDateKey(selectedDate);
    const previousLog = internship.dailyLogs[dateKey];
    const previousHours = previousLog?.hours || 0;

    const updatedDailyLogs = { ...internship.dailyLogs };
    delete updatedDailyLogs[dateKey];

    const newWorkDays = new Set(internship.workDays);
    newWorkDays.delete(dateKey);

    const updatedInternship = {
      ...internship,
      workDays: newWorkDays,
      dailyLogs: updatedDailyLogs,
      completedHours: Math.max(0, internship.completedHours - previousHours),
    };

    onUpdate(updatedInternship);
    closeWorkLogDialog();
  };

  const closeWorkLogDialog = () => {
    setIsLoggingWork(false);
    setSelectedDate(null);
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

    // Actions
    openWorkLogDialog,
    saveWorkLog,
    deleteWorkLog,
    closeWorkLogDialog,
    hasExistingLog,
    setWorkLogForm,
  };
}
