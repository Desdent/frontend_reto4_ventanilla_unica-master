import { AdminViewWorkerStructure } from '../../interfaces/user/admin-view-worker-structure.interface';

export class AdminViewWorkerResponseDto {
  id?: string;
  email: string;
  name: string;
  surname1: string;
  dni: string;
  surname2?: string;
  address?: string;
  phone?: string;
  vacationIds?: string[];
  counterNumber?: number;
  counterId?: string;
  roomNumber?: number;
  roomId?: string;
  service: string;

  // Idk why saving is including parenthesis nor the logic of it
  constructor(data: AdminViewWorkerStructure) {
    ((this.id = data.id),
      (this.email = data.email),
      (this.name = data.name),
      (this.surname1 = data.surname1),
      (this.dni = data.dni));
    ((this.surname2 = data.surname2),
      (this.address = data.address),
      (this.phone = data.phone),
      (this.vacationIds = data.vacationIds),
      (this.counterNumber = data.counterNumber),
      (this.counterId = data.counterId),
      (this.roomNumber = data.roomNumber),
      (this.roomId = data.roomId));
    this.service = data.service;
  }
}
