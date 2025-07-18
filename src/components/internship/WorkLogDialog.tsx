import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WorkLogForm } from "@/types/internship"
import { formatDateLong } from "@/lib/utils/date"

interface WorkLogDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  workLogForm: WorkLogForm
  onFormChange: (form: WorkLogForm) => void
  onSave: () => void
  onDelete: () => void
  hasExistingLog: boolean
}

export function WorkLogDialog({
  isOpen,
  onClose,
  selectedDate,
  workLogForm,
  onFormChange,
  onSave,
  onDelete,
  hasExistingLog,
}: WorkLogDialogProps) {
  const handleInputChange = (field: keyof WorkLogForm, value: string | number) => {
    onFormChange({
      ...workLogForm,
      [field]: value,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-0 shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">
            {selectedDate && formatDateLong(selectedDate)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
              Hours worked
            </Label>
            <Input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={workLogForm.hours}
              onChange={(e) => handleInputChange("hours", Number.parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              What did you work on?
            </Label>
            <Textarea
              id="notes"
              value={workLogForm.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Describe your tasks, projects, or what you learned..."
              rows={4}
              className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={onSave} className="flex-1 bg-gray-900 hover:bg-gray-800">
              Save
            </Button>
            {hasExistingLog && (
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} className="border border-gray-200">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 