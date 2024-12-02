import { getAppointments } from "@/services/appointments_service";
import { fetchServices } from "@/services/birthCenterServices_service";
import DashboardComponent from "./_components/Dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSubscribedPatients } from "@/services/patients_service";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  // If no session or error, redirect to login
  if (!userData || userError) {
    redirect("/login");
  }

  const birthCenterId = userData.user.id;

  const [appointments, services, subscribedPatients] = await Promise.all([
    getAppointments(birthCenterId),
    fetchServices(),
    getSubscribedPatients(birthCenterId),
  ]);

  const subscribedPatientsCount = subscribedPatients?.length ?? 0;

  return (
    <DashboardComponent
      birthCenterId={birthCenterId}
      appointments={appointments}
      services={services}
      subscribedPatientsCount={subscribedPatientsCount}
    />
  );
}
