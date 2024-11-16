import React from "react";
import Patients from "./_components/Patients";
import { getSubscribedPatients } from "@/services/patients_service";
import { createClient } from "@/utils/supabase/server";

export default async function PatientsPage() {
  const supabase = createClient();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let birthCenterId = "";
  if (session) {
    // Use the user's ID as the birth center ID
    birthCenterId = session?.user.id;
  }
  const initialPatients = await getSubscribedPatients(birthCenterId);

  return <Patients initialPatients={initialPatients} />;
}
