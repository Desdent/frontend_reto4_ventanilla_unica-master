import { VacationType } from '../../enums/vacation-type.enum';

export interface CreateVacationRequestStructure {
  startDate: string;
  endDate: string;
  type: VacationType;
  userId: string;
}
