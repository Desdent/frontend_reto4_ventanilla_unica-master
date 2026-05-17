import { CreateUserRequestStructure } from '../../interfaces/user/create-user-structure.interfce';

export class CreateUserRequestDto {
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone: string;

  constructor(data: CreateUserRequestStructure) {
    this.email = data.email;
    this.name = data.email;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;
  }
}
