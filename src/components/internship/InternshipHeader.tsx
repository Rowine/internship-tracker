import { Edit3, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InternshipData } from "@/types/internship"

interface InternshipHeaderProps {
  internship: InternshipData
  onEdit: () => void
}

export function InternshipHeader({ internship, onEdit }: InternshipHeaderProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Internship Tracker</h1>
          <p className="text-gray-500 text-sm">Track your progress and daily activities</p>
        </div>
        <Button
          onClick={onEdit}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{internship.company}</h2>
          <p className="text-sm text-gray-500">{internship.position}</p>
        </div>
      </div>
    </div>
  )
} 