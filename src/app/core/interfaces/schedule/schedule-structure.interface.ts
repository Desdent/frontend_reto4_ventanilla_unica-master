export interface ScheduleDataStructure {
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
}
