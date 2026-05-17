import { AppointmentStatus } from '../../enums/appointment-status';

export interface AppointmentResponseStructure {
  id: string;
  nameUser: string;
  surname1User: string;
  emailUer: string;
  phoneUser: string;
  dniUser: string;
  serviceName: string;
  room: number;
  counter: number;
  nameWorker: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  code: string;
}
