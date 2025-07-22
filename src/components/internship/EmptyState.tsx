import { Button } from "@/components/ui/button"
import { Rocket, Plus, Sparkles, TrendingUp, Award, Target, Clock, Briefcase } from "lucide-react"

interface EmptyStateProps {
  onCreateNew: () => void
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <div className="text-center space-y-10 max-w-2xl animate-fade-in">
        {/* Hero Illustration */}
        <div className="relative">
          <div className="bg-primary w-32 h-32 rounded-3xl flex items-center justify-center mx-auto shadow-glow animate-bounce-in">
            <Rocket className="w-16 h-16 text-white" />
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-bounce-in shadow-glow" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-success rounded-full flex items-center justify-center animate-bounce-in shadow-glow" style={{ animationDelay: '0.4s' }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="absolute top-1/2 -left-8 w-6 h-6 bg-chart-3 rounded-full flex items-center justify-center animate-bounce-in shadow-glow" style={{ animationDelay: '0.6s' }}>
            <Award className="w-3 h-3 text-white" />
          </div>
          <div className="absolute top-1/4 -right-8 w-6 h-6 bg-chart-4 rounded-full flex items-center justify-center animate-bounce-in shadow-glow" style={{ animationDelay: '0.8s' }}>
            <Target className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Welcome to <span className="text-primary font-extrabold">InternTrack</span>
            </h1>
            <h2 className="text-xl font-semibold text-foreground/80">
              Start documenting your internship experience! 📚
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Easily track your internship hours, document your learning, and generate comprehensive
              reports for your academic advisor and program requirements.
            </p>
          </div>

          {/* Value Propositions */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="glass-effect rounded-2xl p-6 hover-lift">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Log Daily Hours</h3>
              <p className="text-sm text-muted-foreground">Document your daily activities and hours worked to meet program requirements</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 hover-lift" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Monitor your completion status and ensure you meet all internship hour requirements</p>
            </div>

            <div className="glass-effect rounded-2xl p-6 hover-lift" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Generate Reports</h3>
              <p className="text-sm text-muted-foreground">Export detailed reports for academic advisors, supervisors, and program coordinators</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <Button
            onClick={onCreateNew}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 h-auto font-semibold min-h-[48px]"
          >
            <Plus className="w-6 h-6 mr-3" />
            Create Your Internship Log
          </Button>

          <p className="text-sm text-muted-foreground">
            Join thousands of students successfully completing their internship requirements ✨
          </p>
        </div>

        {/* Bottom Stats/Social Proof */}
        <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground pt-6 border-t border-border/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span><strong>500+</strong> hours logged this week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span><strong>200+</strong> completed internship programs</span>
          </div>
        </div>
      </div>
    </div>
  )
} 