import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Calendar, FileText, Clock } from "lucide-react"
import type { InternshipData } from "@/types/internship"
import { exportWorkLogs, type ExportOptions } from "@/lib/pdf-export"
import { formatDateKey } from "@/lib/utils/date"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  internship: InternshipData
}

export function ExportDialog({ isOpen, onClose, internship }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exportOptions, setExportOptions] = useState({
    startDate: '',
    endDate: '',
    includeNotes: true,
    format: 'detailed' as 'summary' | 'detailed'
  })

  // Get the actual date range from logs
  const logDates = Object.keys(internship.dailyLogs).sort()
  const earliestLogDate = logDates.length > 0 ? logDates[0] : formatDateKey(new Date())
  const latestLogDate = logDates.length > 0 ? logDates[logDates.length - 1] : formatDateKey(new Date())

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setError(null)

      const options: ExportOptions = {
        internship,
        startDate: exportOptions.startDate ? new Date(exportOptions.startDate) : undefined,
        endDate: exportOptions.endDate ? new Date(exportOptions.endDate) : undefined,
        includeNotes: exportOptions.includeNotes,
        format: exportOptions.format
      }

      // Validate date range
      if (options.startDate && options.endDate && options.startDate > options.endDate) {
        throw new Error('Start date must be before end date')
      }

      await exportWorkLogs(options)

      // Success - close dialog
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    if (!isExporting) {
      setError(null)
      onClose()
    }
  }

  // Calculate statistics for the selected range
  const getStatsForRange = () => {
    const startDate = exportOptions.startDate ? new Date(exportOptions.startDate) : undefined
    const endDate = exportOptions.endDate ? new Date(exportOptions.endDate) : undefined

    let filteredLogs = Object.entries(internship.dailyLogs)

    if (startDate || endDate) {
      filteredLogs = filteredLogs.filter(([dateKey]) => {
        const date = new Date(dateKey)
        if (startDate && date < startDate) return false
        if (endDate && date > endDate) return false
        return true
      })
    }

    const totalHours = filteredLogs.reduce((sum, [, log]) => sum + log.hours, 0)
    const totalDays = filteredLogs.length

    return { totalHours, totalDays }
  }

  const stats = getStatsForRange()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg border-0 shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Work Logs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Internship Info */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Exporting logs for:</span>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">{internship.company}</p>
              <p className="text-sm text-muted-foreground">{internship.position}</p>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium text-muted-foreground">Date Range (Optional)</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs text-muted-foreground">From</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={exportOptions.startDate}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, startDate: e.target.value }))}
                  min={earliestLogDate}
                  max={latestLogDate}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs text-muted-foreground">To</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={exportOptions.endDate}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, endDate: e.target.value }))}
                  min={exportOptions.startDate || earliestLogDate}
                  max={latestLogDate}
                  className="text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Leave empty to export all logs ({logDates.length} entries available)
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-muted-foreground">Export Options</Label>

            {/* Format Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="detailed"
                  name="format"
                  value="detailed"
                  checked={exportOptions.format === 'detailed'}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'detailed' }))}
                  className="text-primary"
                />
                <Label htmlFor="detailed" className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Detailed Report
                  <span className="text-xs text-muted-foreground">(includes all daily entries)</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="summary"
                  name="format"
                  value="summary"
                  checked={exportOptions.format === 'summary'}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as 'summary' }))}
                  className="text-primary"
                />
                <Label htmlFor="summary" className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Summary Only
                  <span className="text-xs text-muted-foreground">(statistics only)</span>
                </Label>
              </div>
            </div>

            {/* Include Notes Option (only for detailed) */}
            {exportOptions.format === 'detailed' && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="includeNotes"
                  checked={exportOptions.includeNotes}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, includeNotes: e.target.checked }))}
                  className="text-primary"
                />
                <Label htmlFor="includeNotes" className="text-sm">
                  Include work notes in export
                </Label>
              </div>
            )}
          </div>

          {/* Preview Stats */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Export Preview</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Days:</span>
                <span className="ml-2 font-semibold">{stats.totalDays}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hours:</span>
                <span className="ml-2 font-semibold">{stats.totalHours}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || stats.totalDays === 0}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
              className="border-border"
            >
              Cancel
            </Button>
          </div>

          {stats.totalDays === 0 && (
            <p className="text-xs text-center text-muted-foreground">
              No logs found for the selected date range
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 