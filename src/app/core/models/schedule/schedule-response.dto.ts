import { ScheduleType } from '../../enums/schedule-type.enum';
import { Workday } from '../../enums/workdays.enum';
import { ScheduleResponseStructure } from '../../interfaces/schedule/schedule-response-structure.interface';

export class ScheduleResponseDto {
  id: string;
  name: string;
  entryTime: string;
  exitTime: string;
  type: ScheduleType;
  isActive: boolean;
  startDate: string;
  endDate: string;
  workdays: Workday[];
  festivities: string[];
  companyId?: string;

  constructor(data: ScheduleResponseStructure) {
    this.id = data.id;
    this.name = data.name;
    this.entryTime = data.entryTime;
    this.exitTime = data.exitTime;
    this.type = data.type;
    this.isActive = data.isActive;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.workdays = data.workdays;
    this.festivities = data.festivities;
  }
}
