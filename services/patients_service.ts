"use server";
import { SubscribedPatient } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export const getPatientDetails = async (
  patientId: string
): Promise<any | null> => {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId);

    return data;
  } catch (error) {
    throw new Error("Failed to fetch patient details");
  }
};

export const getSubscribedPatients = async (birthCenterId: string) => {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("subscribed_patients")
      .select(
        `
          *,
          patients (
            *
          )
        `
      )
      .eq("birthCenterId", birthCenterId)
      .eq("status", "active");

    return data as SubscribedPatient[];
  } catch (error) {
    throw new Error("Failed to fetch subscribed patients");
  }
};
