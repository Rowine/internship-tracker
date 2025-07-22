import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarDay } from "./CalendarDay"
import type { InternshipData } from "@/types/internship"

interface CalendarProps {
  internship: InternshipData
  currentDate: Date
  onDateChange: (date: Date) => void
  onDayClick: (date: Date) => void
}

export function Calendar({ internship, currentDate, onDateChange, onDayClick }: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setMonth(currentDate.getMonth() + 1)
    }
    onDateChange(newDate)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const days = getDaysInMonth(currentDate)

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <p className="text-sm text-muted-foreground">Track your daily progress</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="w-11 h-11 p-0 hover:bg-primary/10 hover:text-primary"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="w-11 h-11 p-0 hover:bg-primary/10 hover:text-primary"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="gradient-card rounded-xl overflow-hidden shadow-card border border-border/50 hover-lift">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 bg-card">
          {days.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              internship={internship}
              onDayClick={onDayClick}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/70 border border-primary/40 rounded-sm shadow-sm"></div>
          <span>Work logged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-border rounded-sm bg-card"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/20 border border-primary/30 rounded-sm"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
} 