import { AdminTypeUserStructure } from '../../interfaces/user/admin-type-structure.interface';

export class AdminTypeUser {
  id: string;
  name: string;
  surname1: string;
  dni: string;
  companyId: string;
  companyName: string;
  email: string;
  phone: string;

  constructor(data: AdminTypeUserStructure) {
    this.id = data.id;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.dni = data.dni;
    this.companyId = data.companyId;
    this.companyName = data.companyName;
    this.email = data.email;
    this.phone = data.phone;
  }
}
