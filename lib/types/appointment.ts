export interface Appointment {
  id?: string;
  birthCenterId?: string;
  patientId?: string;
  patientName?: string;
  serviceId?: number;
  serviceName?: string;
  scheduledAt: Date;
  status: "scheduled" | "completed";
}
