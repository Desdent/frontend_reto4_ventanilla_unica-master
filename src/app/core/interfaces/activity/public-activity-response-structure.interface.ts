export interface PublicActivityResponseStructure {
  id: string;
  name: string;

  companyName?: string;
  companyId?: string;
  floors?: number[];
  rooms?: number[];
  field: string;
  phone: string;
  extraTime: number;
  appointmentDuration: number;
  // It's possible the company from which obtain the schedule doesn't have one yet
  entryTime?: string;
  exitTime?: string;
  workdays?: string[];
  appoointmentDuration?: number;
}
