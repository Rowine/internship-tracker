"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  InternshipHeader,
  InternshipStats,
  Calendar,
  EditInternshipDialog,
  NewInternshipDialog,
  WorkLogDialog,
  ExportDialog,
  EmptyState,
} from "@/components/internship"
import { AuthPage, AuthHeader } from "@/components/auth"
import { useInternshipManager } from "@/hooks/useInternshipManager"
import { useWorkLogManager } from "@/hooks/useWorkLogManager"
import { useExport } from "@/hooks/useExport"
import { useAuth } from "@/hooks/useAuth"

export default function InternshipTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const { user, loading: authLoading } = useAuth()
  const internshipManager = useInternshipManager()
  const workLogManager = useWorkLogManager()
  const exportManager = useExport()

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">
              {authLoading ? "Checking authentication..." : "Loading internships..."}
            </p>
            <p className="text-muted-foreground text-sm mt-1">Please wait a moment</p>
          </div>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
            <p className="text-muted-foreground text-sm">{internshipManager.error}</p>
          </div>
          <Button
            onClick={() => internshipManager.loadInternships()}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            Try Again
          </Button>
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
    <div className="min-h-screen bg-background">
      <AuthHeader />
      <div className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
        <InternshipHeader
          internship={internshipManager.selectedInternship}
          onEdit={internshipManager.openEditDialog}
          onExport={exportManager.openExportDialog}
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

        <ExportDialog
          isOpen={exportManager.isExportDialogOpen}
          onClose={exportManager.closeExportDialog}
          internship={internshipManager.selectedInternship}
        />
      </div>
    </div>
  )
}
