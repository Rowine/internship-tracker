import type { InternshipData } from "@/types/internship"
import { formatDateKey, isToday } from "@/lib/utils/date"

interface CalendarDayProps {
  day: Date | null
  internship: InternshipData
  onDayClick: (date: Date) => void
}

export function CalendarDay({ day, internship, onDayClick }: CalendarDayProps) {
  if (!day) {
    return <div className="h-20 border-r border-b border-gray-100" />
  }

  const dateKey = formatDateKey(day)
  const isWorkDay = internship.workDays.has(dateKey)
  const isTodayDate = isToday(day)
  const dayLog = internship.dailyLogs[dateKey]

  return (
    <button
      onClick={() => onDayClick(day)}
      className={`
        calendar-day h-20 p-3 border-r border-b border-border/30 text-left relative
        ${isTodayDate ? "calendar-day-today" : ""}
        ${isWorkDay ? "calendar-day-work" : "hover:bg-muted/50"}
      `}
    >
      <div
        className={`text-sm font-semibold mb-1 ${isWorkDay ? "text-foreground" :
          isTodayDate ? "text-primary" :
            "text-foreground"
          }`}
      >
        {day.getDate()}
      </div>
      {dayLog && (
        <div className={`text-xs font-medium ${isWorkDay ? "text-foreground/80" :
          "text-muted-foreground"
          }`}>
          {dayLog.hours}h
        </div>
      )}
      {dayLog && (
        <div className="absolute bottom-1 right-1">
          <div className={`w-2 h-2 rounded-full ${isWorkDay ? "bg-primary/70" : "bg-primary/60"
            }`} />
        </div>
      )}
    </button>
  )
} 