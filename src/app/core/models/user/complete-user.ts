import { CompleteUserDataStructure } from '../../interfaces/user/complete-user-structure.interface';

export class CompleteUser {
  id?: string;
  email: string;
  password: string;
  role: string;
  name: string;
  surname1: string;
  dni: string;

  surname2?: string;
  address?: string;
  phone?: string;
  companyId?: string;
  vacationIds?: string[];
  appointmentUserIds?: string[];
  appointmentWorkerIds?: string[];
  counterId?: string;

  constructor(data: CompleteUserDataStructure) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;

    this.companyId = data.companyId;
    this.vacationIds = data.vacationIds;
    this.appointmentUserIds = data.appointmentUserIds;
    this.appointmentWorkerIds = data.appointmentWorkerIds;
    this.counterId = data.counterId;
  }
}
