import { ScheduleType } from '../../enums/schedule-type.enum';
import { Workday } from '../../enums/workdays.enum';

export interface ScheduleResponseStructure {
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
}
