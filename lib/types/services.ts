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
