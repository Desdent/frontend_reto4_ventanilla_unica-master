export interface CreateCompanyRequest {
  name: string;
  phone: string;
  cif: string;
  address: string;
  fieldId: string;
  workerId?: string;
}
