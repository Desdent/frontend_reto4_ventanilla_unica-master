export interface UserResponseStructure {
  id: string;
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}
