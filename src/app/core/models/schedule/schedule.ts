import { ScheduleDataStructure } from '../../interfaces/schedule/schedule-structure.interface';

export class Schedule {
  id?: string;
  name: string;
  entryTime: string; // hh:mm
  exitTime: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  workdays: string[];
  festivities?: Date[];

  companyId: string;

  constructor(data: ScheduleDataStructure) {
    this.id = data.id;
    this.name = data.name;
    this.entryTime = data.entryTime;
    this.exitTime = data.exitTime;
    this.type = data.type;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.workdays = data.workdays;
    this.festivities = data.festivities;

    this.companyId = data.companyId;
  }
}
