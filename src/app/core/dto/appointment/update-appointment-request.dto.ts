import { UpdateAppointmentRequestStructure } from '../../interfaces/appointment/update-appointment-request-structure.interface';

export class UpdateAppointmentRequestDto {
  nameUser: string;
  surname1User: string;
  surname2User?: string;
  emailUser: string;
  dniUser: string;
  phoneUser: string;
  date: string;
  time: string;
  notes: string;

  constructor(data: UpdateAppointmentRequestStructure) {
    this.nameUser = data.nameUser;
    this.surname1User = data.surname1User;
    this.surname2User = data.surname2User;
    this.emailUser = data.emailUser;
    this.dniUser = data.dniUser;
    this.phoneUser = data.phoneUser;
    this.date = data.date;
    this.time = data.time;
    this.notes = data.notes;
  }
}
