import { CreateActivityRequestStructure } from '../../interfaces/activity/create-activity-request-structure.interface';

export class CreateActivityRequestDto {
  name: string;
  extraTime: number;
  appointmentDuration: number;
  fieldId: string;
  companyId: string;
  roomIds?: string[] | null;

  constructor(data: CreateActivityRequestStructure) {
    this.name = data.name;
    this.extraTime = data.extraTime;
    this.appointmentDuration = data.appointmentDuration;
    this.fieldId = data.fieldId;
    this.companyId = data.companyId;
    this.roomIds = data.roomIds;
  }
}
