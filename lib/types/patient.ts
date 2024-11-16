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
