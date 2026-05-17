import { AppointmentStatus } from '../../enums/appointment-status';
import { AppointmentResponseStructure } from '../../interfaces/appointment/appointment-response-structure.interface';

export class AppointmentResponseDto {
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

  constructor(data: AppointmentResponseStructure) {
    this.id = data.id;
    this.nameUser = data.nameUser;
    this.surname1User = data.surname1User;
    this.emailUer = data.emailUer;
    this.phoneUser = data.phoneUser;
    this.dniUser = data.dniUser;
    this.date = data.date;
    this.time = data.time;
    this.status = data.status;
    this.serviceName = data.serviceName;
    this.room = data.room;
    this.counter = data.counter;
    this.nameWorker = data.nameWorker;
    this.code = data.code;
  }
}
