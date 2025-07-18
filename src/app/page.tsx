"use client"

import { useState } from "react"
import {
  InternshipHeader,
  InternshipStats,
  Calendar,
  EditInternshipDialog,
  NewInternshipDialog,
  WorkLogDialog,
  EmptyState,
} from "@/components/internship"
import { useInternshipManager } from "@/hooks/useInternshipManager"
import { useWorkLogManager } from "@/hooks/useWorkLogManager"

export default function InternshipTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const internshipManager = useInternshipManager()
  const workLogManager = useWorkLogManager()

  const handleWorkLogSave = () => {
    if (!internshipManager.selectedInternship) return
    workLogManager.saveWorkLog(
      internshipManager.selectedInternship,
      internshipManager.updateInternship
    )
  }

  const handleWorkLogDelete = () => {
    if (!internshipManager.selectedInternship) return
    workLogManager.deleteWorkLog(
      internshipManager.selectedInternship,
      internshipManager.updateInternship
    )
  }

  const handleDayClick = (date: Date) => {
    if (!internshipManager.selectedInternship) return
    workLogManager.openWorkLogDialog(date, internshipManager.selectedInternship)
  }

  // Empty state when no internships exist
  if (!internshipManager.selectedInternship) {
    return (
      <>
        <EmptyState onCreateNew={internshipManager.openCreateDialog} />
        <NewInternshipDialog
          isOpen={internshipManager.isCreatingNew}
          onClose={internshipManager.closeCreateDialog}
          newInternshipForm={internshipManager.newInternshipForm}
          onFormChange={internshipManager.setNewInternshipForm}
          onSave={internshipManager.saveNew}
        />
      </>
    )
  }

  // Main dashboard when internship is selected
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <InternshipHeader
          internship={internshipManager.selectedInternship}
          onEdit={internshipManager.openEditDialog}
        />

        <InternshipStats internship={internshipManager.selectedInternship} />

        <Calendar
          internship={internshipManager.selectedInternship}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDayClick={handleDayClick}
        />

        <EditInternshipDialog
          isOpen={internshipManager.isEditing}
          onClose={internshipManager.closeEditDialog}
          editForm={internshipManager.editForm}
          onFormChange={internshipManager.setEditForm}
          onSave={internshipManager.saveEdit}
        />

        <NewInternshipDialog
          isOpen={internshipManager.isCreatingNew}
          onClose={internshipManager.closeCreateDialog}
          newInternshipForm={internshipManager.newInternshipForm}
          onFormChange={internshipManager.setNewInternshipForm}
          onSave={internshipManager.saveNew}
        />

        <WorkLogDialog
          isOpen={workLogManager.isLoggingWork}
          onClose={workLogManager.closeWorkLogDialog}
          selectedDate={workLogManager.selectedDate}
          workLogForm={workLogManager.workLogForm}
          onFormChange={workLogManager.setWorkLogForm}
          onSave={handleWorkLogSave}
          onDelete={handleWorkLogDelete}
          hasExistingLog={workLogManager.hasExistingLog(internshipManager.selectedInternship)}
        />
      </div>
    </div>
  )
}
