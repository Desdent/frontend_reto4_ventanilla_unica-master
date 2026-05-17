import { AppointmentStatus } from '../../enums/appointment-status';
import { AppointmentResponseStructure } from '../../interfaces/appointment/appointment-response-structure.interface';
import { FullAppointmentResponseStructure } from '../../interfaces/appointment/full-appointment-response-structure.interface';

export class FullAppointmentResponseDto {
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
  notes: string;

  constructor(data: FullAppointmentResponseStructure) {
    this.id = data.id;
    this.nameUser = data.nameUser;
    this.surname1User = data.surname1User;
    this.surname2User = data.surname2User;
    this.emailUer = data.emailUer;
    this.phoneUser = data.phoneUser;
    this.dniUser = data.dniUser;
    this.date = data.date;
    this.time = data.time;
    this.status = data.status;
    this.serviceName = data.serviceName;
    this.serviceId = data.serviceId;
    this.room = data.room;
    this.counter = data.counter;
    this.nameWorker = data.nameWorker;
    this.code = data.code;
    this.workerId = data.workerId;
    this.workerCompanyId = data.workerCompanyId;
    this.notes = data.notes;
  }
}
