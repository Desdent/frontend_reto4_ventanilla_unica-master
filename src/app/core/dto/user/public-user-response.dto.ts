import { PublicUserResponseStructure } from '../../interfaces/user/public-user-response-structure.interface';

export class PublicUserResponseDto {
  // Used for the self queries

  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;

  constructor(data: PublicUserResponseStructure) {
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;
  }
}
