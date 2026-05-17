export interface CreateAdminRequestInterface {
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  phone?: string;
  companyId: string;
}
