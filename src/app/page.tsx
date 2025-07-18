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
import { AuthPage, AuthHeader } from "@/components/auth"
import { useInternshipManager } from "@/hooks/useInternshipManager"
import { useWorkLogManager } from "@/hooks/useWorkLogManager"
import { useAuth } from "@/hooks/useAuth"

export default function InternshipTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { user, loading: authLoading } = useAuth()
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

  // Show loading spinner while checking authentication or loading internships
  if (authLoading || (user && internshipManager.loading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-600 text-sm">
            {authLoading ? "Checking authentication..." : "Loading internships..."}
          </p>
        </div>
      </div>
    )
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return <AuthPage />
  }

  // Show error if there's an error loading internships
  if (internshipManager.error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-lg">Error loading internships</div>
          <div className="text-gray-600 text-sm">{internshipManager.error}</div>
          <button
            onClick={() => internshipManager.loadInternships()}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty state when no internships exist
  if (!internshipManager.selectedInternship) {
    return (
      <>
        <AuthHeader />
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
      <AuthHeader />
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
          error={workLogManager.error}
        />
      </div>
    </div>
  )
}
