import { PublicUserDataStructure } from '../../interfaces/user/public-user-structure.interface';

export class PublicUser {
  id?: string;
  email: string;
  password: string;
  name: string;
  surname1: string;
  dni: string;

  surname2?: string; // Second surname isn't mandatory
  address?: string;
  phone?: string;

  // This way it is cleaner than it was with the full constructor
  constructor(data: PublicUserDataStructure) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;
  }
}
