import { Appointment } from "../lib/types";

export const formatAppointment = (appointment: any): Appointment => ({
  id: appointment.id,
  patientName: appointment.patients?.fullName,
  serviceName: appointment.birth_center_services?.serviceName,
  scheduledAt: appointment.scheduledAt,
  status: appointment.status,
});
