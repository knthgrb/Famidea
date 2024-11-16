"use server";
import { SubscribedPatient } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getPatientDetails = async (
  patientId: string
): Promise<any | null> => {
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
