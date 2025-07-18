import { Button } from "@/components/ui/button"
import { Target, Plus } from "lucide-react"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
          <Target className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No internships yet</h2>
          <p className="text-gray-500 text-sm">Create your first internship to start tracking your progress</p>
        </div>
        <Button onClick={onCreateNew} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Internship
        </Button>
      </div>
    </div>
  )
} 