import { supabase } from "./supabaseClient";
import type { InternshipData, DailyLog } from "@/types/internship";

// Types for database operations
export interface DatabaseInternship {
  id: string;
  user_id: string;
  company: string;
  position: string;
  total_hours: number;
  completed_hours: number;
  start_date: string;
  end_date: string;
  inserted_at?: string;
}

export interface DatabaseWorkLog {
  id: string;
  internship_id: string;
  log_date: string;
  hours: number;
  notes: string;
  inserted_at?: string;
}

// Convert database internship to app format
function convertToInternshipData(
  dbInternship: DatabaseInternship,
  workLogs: DatabaseWorkLog[]
): InternshipData {
  const dailyLogs: Record<string, DailyLog> = {};
  const workDays = new Set<string>();

  workLogs.forEach((log) => {
    dailyLogs[log.log_date] = {
      hours: log.hours,
      notes: log.notes,
    };
    if (log.hours > 0) {
      workDays.add(log.log_date);
    }
  });

  return {
    id: dbInternship.id,
    user_id: dbInternship.user_id,
    company: dbInternship.company,
    position: dbInternship.position,
    totalHours: dbInternship.total_hours,
    completedHours: dbInternship.completed_hours,
    startDate: dbInternship.start_date,
    endDate: dbInternship.end_date,
    workDays,
    dailyLogs,
  };
}

// INTERNSHIP OPERATIONS
export async function createInternship(
  internshipData: Omit<InternshipData, "id" | "workDays" | "dailyLogs">
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("internships")
    .insert([
      {
        user_id: user.id,
        company: internshipData.company,
        position: internshipData.position,
        total_hours: internshipData.totalHours,
        completed_hours: internshipData.completedHours,
        start_date: internshipData.startDate,
        end_date: internshipData.endDate,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return convertToInternshipData(data, []);
}

export async function getInternships(): Promise<InternshipData[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data: internships, error: internshipsError } = await supabase
    .from("internships")
    .select("*")
    .eq("user_id", user.id)
    .order("inserted_at", { ascending: false });

  if (internshipsError) throw internshipsError;

  if (!internships || internships.length === 0) {
    return [];
  }

  // Get all work logs for all internships
  const internshipIds = internships.map((i) => i.id);
  const { data: workLogs, error: workLogsError } = await supabase
    .from("work_logs")
    .select("*")
    .in("internship_id", internshipIds);

  if (workLogsError) throw workLogsError;

  // Group work logs by internship
  const workLogsByInternship = (workLogs || []).reduce((acc, log) => {
    if (!acc[log.internship_id]) {
      acc[log.internship_id] = [];
    }
    acc[log.internship_id].push(log);
    return acc;
  }, {} as Record<string, DatabaseWorkLog[]>);

  return internships.map((internship) =>
    convertToInternshipData(
      internship,
      workLogsByInternship[internship.id] || []
    )
  );
}

export async function updateInternship(
  id: string,
  updates: Partial<InternshipData>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const updateData: Partial<DatabaseInternship> = {};

  if (updates.company !== undefined) updateData.company = updates.company;
  if (updates.position !== undefined) updateData.position = updates.position;
  if (updates.totalHours !== undefined)
    updateData.total_hours = updates.totalHours;
  if (updates.completedHours !== undefined)
    updateData.completed_hours = updates.completedHours;
  if (updates.startDate !== undefined)
    updateData.start_date = updates.startDate;
  if (updates.endDate !== undefined) updateData.end_date = updates.endDate;

  const { data, error } = await supabase
    .from("internships")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  // Get updated work logs
  const { data: workLogs, error: workLogsError } = await supabase
    .from("work_logs")
    .select("*")
    .eq("internship_id", id);

  if (workLogsError) throw workLogsError;

  return convertToInternshipData(data, workLogs || []);
}

export async function deleteInternship(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("internships")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

// WORK LOG OPERATIONS
export async function createWorkLog(
  internshipId: string,
  logDate: string,
  hours: number,
  notes: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Verify user owns this internship
  const { data: internship, error: internshipError } = await supabase
    .from("internships")
    .select("id")
    .eq("id", internshipId)
    .eq("user_id", user.id)
    .single();

  if (internshipError || !internship) {
    throw new Error("Internship not found or access denied");
  }

  const { data, error } = await supabase
    .from("work_logs")
    .insert([
      {
        internship_id: internshipId,
        log_date: logDate,
        hours,
        notes,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateWorkLog(
  internshipId: string,
  logDate: string,
  hours: number,
  notes: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // First, try to update existing log
  const { data, error } = await supabase
    .from("work_logs")
    .update({ hours, notes })
    .eq("internship_id", internshipId)
    .eq("log_date", logDate)
    .select()
    .single();

  if (error) {
    // If no existing log, create new one
    if (error.code === "PGRST116") {
      return await createWorkLog(internshipId, logDate, hours, notes);
    }
    throw error;
  }

  return data;
}

export async function deleteWorkLog(internshipId: string, logDate: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("work_logs")
    .delete()
    .eq("internship_id", internshipId)
    .eq("log_date", logDate);

  if (error) throw error;
}

// Helper function to recalculate completed hours
export async function recalculateCompletedHours(internshipId: string) {
  const { data: workLogs, error } = await supabase
    .from("work_logs")
    .select("hours")
    .eq("internship_id", internshipId);

  if (error) throw error;

  const totalHours = (workLogs || []).reduce((sum, log) => sum + log.hours, 0);

  const { error: updateError } = await supabase
    .from("internships")
    .update({ completed_hours: totalHours })
    .eq("id", internshipId);

  if (updateError) throw updateError;

  return totalHours;
}
