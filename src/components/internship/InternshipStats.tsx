import { Target, Clock, Trophy, TrendingUp, CheckCircle, Zap, Award, Star, Flame, Users } from "lucide-react"
import type { InternshipData } from "@/types/internship"
import { useEffect, useState } from "react"

interface InternshipStatsProps {
  internship: InternshipData
}

export function InternshipStats({ internship }: InternshipStatsProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

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

      // Show celebration when reaching milestones
      if (targetProgress >= 100 || (targetProgress > 0 && targetProgress % 25 === 0)) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [mounted, internship.completedHours, internship.totalHours])

  const getRemainingHours = () => {
    return Math.max(0, internship.totalHours - internship.completedHours)
  }

  const getWorkDaysCount = () => {
    return internship.workDays.size
  }

  const getStreak = () => {
    // Calculate consecutive work days (simplified logic)
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateKey = checkDate.toISOString().split('T')[0]
      if (internship.workDays.has(dateKey)) {
        streak++
      } else if (streak > 0) {
        break
      }
    }
    return streak
  }

  const getAchievements = () => {
    const achievements = []
    const progress = getProgressPercentage()
    const workDays = getWorkDaysCount()
    const streak = getStreak()

    if (progress >= 25) achievements.push({ icon: Star, name: "Quarter Complete", desc: "25% of hours logged" })
    if (progress >= 50) achievements.push({ icon: Trophy, name: "Halfway Point", desc: "50% of hours logged" })
    if (progress >= 75) achievements.push({ icon: Award, name: "Nearly Complete", desc: "75% of hours logged" })
    if (progress >= 100) achievements.push({ icon: CheckCircle, name: "Requirements Met", desc: "All hours completed!" })
    if (workDays >= 10) achievements.push({ icon: Target, name: "Consistent Logger", desc: "10+ days recorded" })
    if (workDays >= 30) achievements.push({ icon: Flame, name: "Dedicated Student", desc: "30+ days recorded" })
    if (streak >= 7) achievements.push({ icon: Zap, name: "Weekly Logger", desc: "7-day logging streak" })
    if (streak >= 14) achievements.push({ icon: Users, name: "Consistent Tracker", desc: "14-day logging streak" })

    return achievements.slice(-3) // Show last 3 achievements
  }

  const getMotivationalMessage = () => {
    const progress = getProgressPercentage()
    if (progress >= 100) return "🎉 Excellent! You've completed all required internship hours!"
    if (progress >= 75) return "🔥 Almost there! You're close to meeting your hour requirements!"
    if (progress >= 50) return "💪 Halfway complete! You're on track to finish on time!"
    if (progress >= 25) return "🌟 Good progress! Keep logging your daily activities!"
    if (progress > 0) return "🚀 Great start! Continue documenting your internship experience!"
    return "✨ Ready to start logging? Begin tracking your internship hours!"
  }

  const stats = [
    {
      icon: Target,
      title: "Overall Progress",
      value: `${getProgressPercentage().toFixed(0)}%`,
      subtitle: `${internship.completedHours}h / ${internship.totalHours}h completed`,
      color: "primary",
      showProgress: true,
      progressValue: getProgressPercentage(),
      gradient: "gradient-primary"
    },
    {
      icon: Flame,
      title: "Current Streak",
      value: `${getStreak()}`,
      subtitle: getStreak() === 1 ? "day in a row" : "days in a row",
      color: "chart-5",
      showProgress: false,
      gradient: "gradient-success"
    },
    {
      icon: Trophy,
      title: "Work Days",
      value: `${getWorkDaysCount()}`,
      subtitle: "total days logged",
      color: "accent",
      showProgress: false,
      gradient: "gradient-accent"
    },
    {
      icon: Clock,
      title: "Hours Left",
      value: `${getRemainingHours()}`,
      subtitle: "to reach your goal",
      color: "secondary",
      showProgress: false,
      gradient: "gradient-card"
    },
  ]

  const achievements = getAchievements()

  return (
    <div className="space-y-8 mb-8">
      {/* Motivational Header */}
      <div className="text-center space-y-4 animate-slide-up">
        <div className="glass-effect rounded-2xl p-6 shadow-card border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getProgressPercentage() >= 100 ? (
              <CheckCircle className="w-6 h-6 text-success" />
            ) : (
              <TrendingUp className="w-6 h-6 text-primary" />
            )}
            <h3 className="text-xl font-bold text-foreground">Your Internship Progress</h3>
          </div>
          <p className="text-muted-foreground text-lg">{getMotivationalMessage()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="glass-effect rounded-2xl p-6 shadow-card hover-lift border border-border/20 animate-bounce-in relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Pattern */}
            <div className={`absolute inset-0 opacity-5 ${stat.gradient}`} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.title === "Current Streak" && getStreak() >= 7 && (
                  <div className="animate-pulse">
                    🔥
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  {stat.title === "Overall Progress" && getProgressPercentage() >= 100 && (
                    <div className={`animate-bounce ${showCelebration ? 'scale-125' : 'scale-100'} transition-transform`}>
                      🎉
                    </div>
                  )}
                </div>
              </div>

              {stat.showProgress && (
                <div className="mt-4 space-y-3">
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressPercentage() >= 100
                        ? "gradient-success"
                        : "gradient-primary"
                        } ${showCelebration ? 'animate-pulse' : ''}`}
                      style={{
                        width: `${Math.max(animatedProgress, animatedProgress > 0 ? 5 : 0)}%`,
                        minWidth: animatedProgress > 0 ? '8px' : '0px',
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.subtitle}</p>
                </div>
              )}

              {!stat.showProgress && (
                <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-effect rounded-2xl p-6 shadow-card border border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center shadow-glow">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Progress Milestones</h3>
                <p className="text-sm text-muted-foreground">Your internship tracking achievements</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.name}
                  className="flex items-center gap-2 glass-effect rounded-xl px-4 py-2 border border-primary/20 hover-lift animate-bounce-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <achievement.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 