import { Edit3, Building2, Calendar, Download, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InternshipData } from "@/types/internship"
import { formatDateDisplay } from "@/lib/utils/date"

interface InternshipHeaderProps {
  internship: InternshipData
  onEdit: () => void
  onExport: () => void
}

export function InternshipHeader({ internship, onEdit, onExport }: InternshipHeaderProps) {
  const getDuration = () => {
    const start = new Date(internship.startDate)
    const end = new Date(internship.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    return `${diffWeeks} weeks`
  }

  const getProgressText = () => {
    const progress = (internship.completedHours / internship.totalHours) * 100
    if (progress >= 100) return "Requirements Complete! 🎉"
    if (progress >= 75) return "Almost Finished! 🔥"
    if (progress >= 50) return "Halfway Complete! 💪"
    if (progress >= 25) return "Good Progress! ⭐"
    return "Just Started! 🚀"
  }

  return (
    <div className="mb-8 animate-slide-up">
      {/* Main Header Card */}
      <div className="glass-effect rounded-3xl p-8 shadow-card hover-lift border border-border/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero opacity-30" />
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 gradient-accent opacity-5 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Company Info */}
            <div className="flex items-start gap-6">
              <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-1">{internship.company}</h1>
                  <div className="flex items-center gap-2 text-xl text-muted-foreground">
                    <User className="w-5 h-5" />
                    <span>{internship.position}</span>
                  </div>
                </div>

                {/* Duration and Progress Badge */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="glass-effect rounded-xl px-4 py-2 border border-primary/20">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {formatDateDisplay(internship.startDate)} - {formatDateDisplay(internship.endDate)}
                      </span>
                      <span className="text-muted-foreground">({getDuration()})</span>
                    </div>
                  </div>

                  <div className="glass-effect rounded-xl px-4 py-2 border border-success/20 bg-success/5">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-success" />
                      <span className="font-medium text-foreground">{getProgressText()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span><strong>{internship.completedHours}</strong> hours logged</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span><strong>{internship.workDays.size}</strong> work days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span><strong>{Math.round((internship.completedHours / internship.totalHours) * 100)}%</strong> complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-fit">
              <Button
                onClick={onExport}
                variant="outline"
                size="lg"
                className="border-success/30 text-success hover:bg-success/10 hover:border-success/50 transition-all duration-200 shadow-sm hover:shadow-glow font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                Generate Report
              </Button>

              <Button
                onClick={onEdit}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white hover:shadow-glow transition-all duration-300 transform hover:scale-105 font-semibold min-h-[48px]"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Development Note */}
      <div className="mt-4 glass-effect rounded-2xl p-4 border border-info/20 bg-info/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-glow flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Academic Internship Documentation</p>
            <p className="text-xs text-muted-foreground">
              Documenting your internship experience for academic requirements and advisor reporting.
              {internship.completedHours > 0 && ` You've logged ${internship.completedHours} hours toward your program requirements.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 