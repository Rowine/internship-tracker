import { Target, Clock, Trophy, TrendingUp, CheckCircle } from "lucide-react"
import type { InternshipData } from "@/types/internship"
import { useEffect, useState } from "react"

interface InternshipStatsProps {
  internship: InternshipData
}

export function InternshipStats({ internship }: InternshipStatsProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  const getProgressPercentage = () => {
    return Math.min(100, (internship.completedHours / internship.totalHours) * 100)
  }

  // Handle component mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate progress bar on mount and updates
  useEffect(() => {
    if (!mounted) return

    const targetProgress = getProgressPercentage()
    // Small delay for smooth animation effect
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress)
    }, 100)

    return () => clearTimeout(timer)
  }, [mounted, internship.completedHours, internship.totalHours])

  const getRemainingHours = () => {
    return Math.max(0, internship.totalHours - internship.completedHours)
  }

  const getWorkDaysCount = () => {
    return internship.workDays.size
  }

  const stats = [
    {
      icon: Target,
      title: "Progress",
      value: `${getProgressPercentage().toFixed(1)}%`,
      subtitle: `${internship.completedHours} of ${internship.totalHours} hours`,
      color: "primary",
      showProgress: true,
      progressValue: getProgressPercentage(),
    },
    {
      icon: Clock,
      title: "Remaining",
      value: `${getRemainingHours()}`,
      subtitle: "hours left",
      color: "secondary",
      showProgress: false,
    },
    {
      icon: Trophy,
      title: "Work Days",
      value: `${getWorkDaysCount()}`,
      subtitle: "days logged",
      color: "accent",
      showProgress: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="gradient-card rounded-xl p-6 shadow-card hover-lift border border-border/50 animate-bounce-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  {stat.title === "Progress" && (
                    getProgressPercentage() >= 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {stat.showProgress && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressPercentage() >= 100
                    ? "bg-green-600"
                    : "gradient-primary bg-blue-600"
                    }`}
                  style={{
                    width: `${Math.max(animatedProgress, animatedProgress > 0 ? 2 : 0)}%`,
                    minWidth: animatedProgress > 0 ? '4px' : '0px',
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </div>
          )}

          {!stat.showProgress && (
            <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  )
} 