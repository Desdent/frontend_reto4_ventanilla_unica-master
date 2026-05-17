import { AppointmentStatus } from '../../enums/appointment-status';

export interface FullAppointmentResponseStructure {
  id: string;
  nameUser: string;
  surname1User: string;
  surname2User?: string;
  emailUer: string;
  phoneUser: string;
  dniUser: string;
  serviceName: string;
  serviceId: string;
  room: number;
  counter: number;
  nameWorker: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  code: string;
  workerId: string;
  workerCompanyId: string;
}
