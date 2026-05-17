import { PublicSelfUpdateRequestStructure } from '../../interfaces/user/self-update-user-request.structure';

export class PublicSelfUpdateRequestDto {
  // Used for the self queries

  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;
  password: string;

  constructor(data: PublicSelfUpdateRequestStructure) {
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;
    this.password = data.password;
  }
}
