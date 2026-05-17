import { VacationDataStructure } from '../../interfaces/vacation/vacation-data-structure';

export class Vacation {
  id?: string;
  status?: string;
  startDate: Date;
  endDate: Date;
  type: string;
  userId?: string;

  constructor(data: VacationDataStructure) {
    this.id = data.id;
    this.status = data.status;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.type = data.type;
    this.userId = data.userId;
  }
}
