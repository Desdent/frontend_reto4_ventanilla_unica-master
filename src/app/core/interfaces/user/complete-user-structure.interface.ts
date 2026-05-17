export interface CompleteUserDataStructure {
  id?: string;
  email: string;
  password: string;
  role: string;
  name: string;
  surname1: string;
  dni: string;

  surname2?: string; // Second surname isn't mandatory
  address?: string;
  phone?: string;
  companyId?: string;
  vacationIds?: string[];
  appointmentUserIds?: string[]; // Appointment's ids on the base user type side
  appointmentWorkerIds?: string[]; // Appointment's ids on the worker user type side
  counterId?: string; // La id de la mesa con la que se relaciona el usuario worker
}
