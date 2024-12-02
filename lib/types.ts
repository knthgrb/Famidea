export interface ServiceData {
  id?: number;
  birthCenterId?: string;
  serviceName: string;
  serviceDescription: string;
  duration: string;
  price: number;
  status: string;
  created_at?: string;
}

export interface DatabaseServiceData {
  id: number;
  birthCenterId: string;
  serviceName: string;
  serviceDescription: string;
  duration: string;
  price: number;
  status: string;
  created_at: string;
}

export interface Appointment {
  id?: string;
  birthCenterId?: string;
  patientId?: string;
  patientName?: string;
  serviceId?: number;
  serviceName?: string;
  scheduledAt: Date;
  status: "scheduled" | "completed" | "canceled";
}

export interface Patient {
  id?: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  gender: string;
  birthDate: string;
  birthCenterId: string;
  latitude?: number;
  longitude?: number;
  age: number;
  created_at?: string;
}

export interface SubscribedPatient {
  id: string;
  patientId: string;
  birthCenterId: string;
  status: string;
  patients: Patient;
  subscribedOn: string;
  subscriptionExpiry: string;
  created_at?: string;
}
