import { Edit3, Building2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InternshipData } from "@/types/internship"
import { formatDateDisplay } from "@/lib/utils/date"

interface InternshipHeaderProps {
  internship: InternshipData
  onEdit: () => void
}

export function InternshipHeader({ internship, onEdit }: InternshipHeaderProps) {
  return (
    <div className="mb-8 animate-slide-up">
      {/* Company Info Card */}
      <div className="gradient-card rounded-2xl p-6 shadow-card hover-lift border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-glow">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{internship.company}</h2>
              <p className="text-muted-foreground">{internship.position}</p>
            </div>
          </div>

          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDateDisplay(internship.startDate)} - {formatDateDisplay(internship.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 