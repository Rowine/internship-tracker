import { Target, Clock, Calendar } from "lucide-react"
import type { InternshipData } from "@/types/internship"
import { formatDateDisplay } from "@/lib/utils/date"

interface InternshipStatsProps {
  internship: InternshipData
}

export function InternshipStats({ internship }: InternshipStatsProps) {
  const getProgressPercentage = () => {
    return Math.min(100, (internship.completedHours / internship.totalHours) * 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Target className="w-4 h-4" />
          Progress
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900">{getProgressPercentage().toFixed(1)}%</span>
            <span className="text-sm text-gray-500">
              {internship.completedHours} of {internship.totalHours} hours
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          Remaining
        </div>
        <div className="text-2xl font-semibold text-gray-900">
          {internship.totalHours - internship.completedHours} hours
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          Duration
        </div>
        <div className="text-sm text-gray-600">
          {formatDateDisplay(internship.startDate)} -{" "}
          {formatDateDisplay(internship.endDate)}
        </div>
      </div>
    </div>
  )
} 