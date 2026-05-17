export interface CreateAppointmentRequest {
  nameUser: string;
  surname1User: string;
  surname2User?: string;
  emailUser: string;
  dniUser: string;
  phoneUser: string;
  date: string;
  time: string;
  workerId: string;
  userId: string;
  counterId: string;
  serviceId: string;
  extraTime?: number;
  appointmentDuration?: number;
  notes: string;
}
