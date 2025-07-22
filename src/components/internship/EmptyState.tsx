import { Button } from "@/components/ui/button"
import { Target, Plus, Sparkles, TrendingUp } from "lucide-react"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md animate-fade-in">
        {/* Illustration */}
        <div className="relative">
          <div className="gradient-primary w-24 h-24 rounded-2xl flex items-center justify-center mx-auto shadow-glow animate-bounce-in">
            <Target className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-chart-1 rounded-full flex items-center justify-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <TrendingUp className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ready to start your journey?</h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Create your first internship and begin tracking your professional growth with our beautiful dashboard
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Track daily work hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Monitor your progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Stay organized & motivated</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={onCreateNew}
            size="lg"
            className="gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Internship
          </Button>
        </div>
      </div>
    </div>
  )
} 