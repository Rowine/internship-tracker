import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EditInternshipForm } from "@/types/internship"

interface NewInternshipDialogProps {
  isOpen: boolean
  onClose: () => void
  newInternshipForm: EditInternshipForm
  onFormChange: (form: EditInternshipForm) => void
  onSave: () => void
}

export function NewInternshipDialog({
  isOpen,
  onClose,
  newInternshipForm,
  onFormChange,
  onSave,
}: NewInternshipDialogProps) {
  const handleInputChange = (field: keyof EditInternshipForm, value: string | number) => {
    onFormChange({
      ...newInternshipForm,
      [field]: value,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-0 shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">Create New Internship</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-gray-700">
              Company *
            </Label>
            <Input
              id="company"
              value={newInternshipForm.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Enter company name"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="text-sm font-medium text-gray-700">
              Position *
            </Label>
            <Input
              id="position"
              value={newInternshipForm.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              placeholder="Enter position title"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalHours" className="text-sm font-medium text-gray-700">
              Total Hours Required *
            </Label>
            <Input
              id="totalHours"
              type="number"
              min="1"
              value={newInternshipForm.totalHours}
              onChange={(e) => handleInputChange("totalHours", Number.parseInt(e.target.value) || 0)}
              placeholder="Enter total hours"
              className="border-gray-200 focus:border-gray-400 focus:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newInternshipForm.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="border-gray-200 focus:border-gray-400 focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newInternshipForm.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="border-gray-200 focus:border-gray-400 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSave}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
              disabled={!newInternshipForm.company || !newInternshipForm.position || !newInternshipForm.totalHours || !newInternshipForm.startDate || !newInternshipForm.endDate}
            >
              Create Internship
            </Button>
            <Button variant="ghost" onClick={onClose} className="border border-gray-200">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 