import { redirect } from "next/navigation";
import Appointments from "./_components/Appointments";
import { getAppointments } from "@/services/appointments_service";
import { createClient } from "@/utils/supabase/server";

export default async function AppointmentsPage() {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  // If no session or error, redirect to login
  if (!userData || userError) {
    redirect("/login");
  }

  const birthCenterId = userData.user.id;

  const appointments = await getAppointments(birthCenterId);

  return <Appointments initialAppointments={appointments} />;
}
