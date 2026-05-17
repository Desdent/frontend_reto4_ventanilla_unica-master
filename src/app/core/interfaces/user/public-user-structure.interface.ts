export interface PublicUserDataStructure {
  id?: string;
  email: string;
  password: string;
  name: string;
  surname1: string;
  dni: string;

  surname2?: string; // Second surname isn't mandatory
  address?: string;
  phone?: string;
}
