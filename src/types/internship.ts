export interface DailyLog {
  hours: number;
  notes: string;
}

export interface InternshipData {
  id: string;
  company: string;
  position: string;
  totalHours: number;
  completedHours: number;
  startDate: string;
  endDate: string;
  workDays: Set<string>;
  dailyLogs: Record<string, DailyLog>;
}

export interface EditInternshipForm {
  company: string;
  position: string;
  totalHours: number;
  startDate: string;
  endDate: string;
}

export interface WorkLogForm {
  hours: number;
  notes: string;
}
