export interface CreateWorkerRequestStructure {
  email: string;
  name: string;
  surname1: string;
  surname2?: string;
  dni: string;
  address?: string;
  phone?: string;
  companyId: string;
  counterId: string;
}
