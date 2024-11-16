import Appointments from "./_components/Appointments";
import { getAppointments } from "@/services/appointments_service";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return <Appointments initialAppointments={appointments} />;
}
