import { CreateAdminRequestInterface } from '../../interfaces/requests/create-admin-request.interface';

export class CreateAdminRequest {
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  phone?: string;
  companyId: string;

  constructor(data: CreateAdminRequestInterface) {
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.companyId = data.companyId;
  }
}
