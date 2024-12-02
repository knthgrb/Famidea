"use server";
import { formatAppointment } from "@/utils/formatAppointment";
import { createClient } from "@/utils/supabase/server";
import { Appointment } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getAppointments(birthCenterId: string) {
  const supabase = createClient();
  const statuses = ["scheduled", "completed", "canceled"];
  console.log("birthCenterId", birthCenterId);
  try {
    const results = await Promise.all(
      statuses.map((status) =>
        supabase
          .from("appointments")
          .select(
            `
            id,
            scheduledAt,
            status,
            patients(fullName),
            birth_center_services(serviceName)
          `
          )
          .eq("birthCenterId", birthCenterId)
          .eq("status", status)
      )
    );

    const appointments: {
      scheduled: Appointment[];
      completed: Appointment[];
      canceled: Appointment[];
    } = {
      scheduled: results[0].data?.map(formatAppointment) || [],
      completed: results[1].data?.map(formatAppointment) || [],
      canceled: results[2].data?.map(formatAppointment) || [],
    };

    return appointments;
  } catch (error) {
    console.log("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
}

export async function createAppointment(appointment: Appointment) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("appointments").insert(appointment);

    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/appointments");
  } catch (error) {
    throw new Error("Failed to create appointment");
  }
}

export async function updateCompletedAppointmentStatus(appointmentId: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "completed" })
      .eq("id", appointmentId);

    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/appointments");
  } catch (error) {
    throw new Error("Failed to update appointment status");
  }
}

export async function deleteAppointmentRecord(appointmentId: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId);

    if (error) {
      throw error;
    }
    revalidatePath("/appointments");
  } catch (error) {
    throw new Error("Failed to delete appointment record");
  }
}

export async function getAppointmentsOfAPatient(
  patientId: string,
  birthCenterId: string
) {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .eq("patientId", patientId)
      .eq("birthCenterId", birthCenterId);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch appointments");
  }
}
