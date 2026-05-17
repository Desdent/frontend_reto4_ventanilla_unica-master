import { VacationStatus } from '../../enums/vacation-status.enum';
import { VacationType } from '../../enums/vacation-type.enum';

export interface VacationResponseStructure {
  id: string;
  status: VacationStatus;
  startDate: string;
  endDate: string;
  type: VacationType;
  userName: string;
  userSurname1: string;
  userId: string;
}
