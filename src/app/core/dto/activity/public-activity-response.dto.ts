import { PublicActivityResponseStructure } from '../../interfaces/activity/public-activity-response-structure.interface';

export class PublicActivityResponseDto {
  constructor(data: PublicActivityResponseStructure) {
    this.id = data.id;
    this.name = data.name;

    this.companyName = data.companyName;
    this.companyId = data.companyId;
    this.floors = data.floors;
    this.rooms = data.rooms;
    this.field = data.field;
    this.phone = data.phone;
    this.extraTime = data.extraTime;
    this.appointmentDuration = data.appointmentDuration;
    // It's possible the company from which obtain the schedule doesn't have one yet
    this.entryTime = data.entryTime;
    this.exitTime = data.exitTime;
    this.workdays = data.workdays;
    this.appoointmentDuration = data.appoointmentDuration;
  }

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
