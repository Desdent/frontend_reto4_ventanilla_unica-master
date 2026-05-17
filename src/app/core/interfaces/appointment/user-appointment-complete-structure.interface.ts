import { AppointmentStatus } from '../../enums/appointment-status';

export interface UserAppointmentDataStructure {
  id: string;
  nameUser: string;
  surname1User: string;
  surname2User?: string;
  emailUser: string;
  dniUser: string;
  phoneUser: string;
  // The fields may come from the user data directly or from a form when there isn't a logged user
  date: Date;
  time: string;
  status: AppointmentStatus;
  confirmationCode?: string; // It should be created in the handler

  workerId: string;
  userId?: string;
  counterId: string;
  serviceId: string;
}
