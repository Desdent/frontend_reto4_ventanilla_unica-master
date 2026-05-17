import { Floor } from '../../enums/Floor.enum';
import { ActivityResponseStructure } from '../../interfaces/activity/activity-response-structure.interface';

export class ActivityResponseDto {
  id: string;
  name: string;
  fieldName: string;
  fieldId: string;
  companyName: string;
  floors: Floor[];
  rooms?: number[];
  extraTime: number;
  appointmentDuration: number;

  constructor(data: ActivityResponseStructure) {
    this.id = data.id;
    this.name = data.name;
    this.fieldName = data.name;
    this.fieldId = data.fieldId;
    this.companyName = data.companyName;
    this.floors = data.floors;
    this.rooms = data.rooms;
    this.extraTime = data.extraTime;
    this.appointmentDuration = data.appointmentDuration;
  }
}
