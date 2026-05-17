import { UserResponseStructure } from '../../interfaces/user/user-response-structure.interface';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;
  isActive: boolean;

  constructor(data: UserResponseStructure) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.surname1 = data.surname1;
    this.surname2 = data.surname2;
    this.dni = data.dni;
    this.address = data.address;
    this.phone = data.phone;
    this.isActive = data.isActive;
  }
}
