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
        h-20 p-2 border-r border-b border-gray-100 text-left hover:bg-gray-50 transition-colors
        ${isTodayDate ? "bg-blue-50 border-blue-200" : ""}
        ${isWorkDay ? "bg-gray-900 text-white hover:bg-gray-800" : ""}
      `}
    >
      <div
        className={`text-sm font-medium mb-1 ${isWorkDay ? "text-white" : isTodayDate ? "text-blue-600" : "text-gray-900"
          }`}
      >
        {day.getDate()}
      </div>
      {dayLog && (
        <div className={`text-xs ${isWorkDay ? "text-gray-300" : "text-gray-500"}`}>
          {dayLog.hours}h
        </div>
      )}
    </button>
  )
} 