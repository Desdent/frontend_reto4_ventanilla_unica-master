import { VacationType } from '../../enums/vacation-type.enum';
import { CreateVacationRequestStructure } from '../../interfaces/vacation/create-vacation-request-structure.interface';

export class CreateVacationRequestDto {
  startDate: string;
  endDate: string;
  type: VacationType;
  userId: string;

  constructor(data: CreateVacationRequestStructure) {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.type = data.type;
    this.userId = data.userId;
  }
}
