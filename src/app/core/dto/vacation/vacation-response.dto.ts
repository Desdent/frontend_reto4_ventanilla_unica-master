import { VacationStatus } from '../../enums/vacation-status.enum';
import { VacationType } from '../../enums/vacation-type.enum';
import { VacationResponseStructure } from '../../interfaces/vacation/vacation-response-structure';

export class VacationResponseDto {
  id: string;
  status: VacationStatus;
  startDate: string;
  endDate: string;
  type: VacationType;
  userName: string;
  userSurname1: string;
  userId: string;

  constructor(data: VacationResponseStructure) {
    ((this.id = data.id),
      (this.status = data.status),
      (this.startDate = data.startDate),
      (this.endDate = data.endDate),
      (this.type = data.type),
      (this.userName = data.userName),
      (this.userSurname1 = data.userSurname1),
      (this.userId = data.userId));
  }
}
