import { CreateWorkerRequestStructure } from '../../interfaces/user/create-worker-request.interface';

export class CreateWorkerRequestDto {
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;
  companyId: string;
  counterId: string;

  constructor(data: CreateWorkerRequestStructure) {
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.phone = data.phone;
    this.companyId = data.companyId;
    this.counterId = data.counterId;
  }
}
