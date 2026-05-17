import { PublicAppointmentStructure } from '../../interfaces/appointment/public-appointment-structure.interface';

export class PublicAppointment {
  id?: string;
  date: Date;
  time: string;

  constructor(data: PublicAppointmentStructure) {
    this.id = data.id;
    this.date = data.date;
    this.time = data.time;
  }
}
