export interface PublicWorkerDataStructure {
  id?: string;
  email: string;
  password: string;
  name: string;
  surname1: string;

  surname2?: string; // Second surname isn't mandatory
  vacationIds?: string[];
  companyId?: string;
  counterId?: string;
}
