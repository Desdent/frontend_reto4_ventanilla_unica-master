import { PublicWorkerDataStructure } from '../../interfaces/user/public-worker-structure.interface';

export class PublicWorker {
  id?: string;
  email: string;
  name: string;
  surname1: string;

  surname2?: string; // Second surname isn't mandatory
  vacationIds?: string[];
  companyId?: string;
  counterId?: string;

  constructor(data: PublicWorkerDataStructure) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;

    this.surname2 = data.surname2;
    this.vacationIds = data.vacationIds;
    this.companyId = data.companyId;
    this.counterId = data.counterId;
  }
}
