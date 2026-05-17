export interface CompanyStructure {
  id?: string;
  name: string;
  cif: string;
  phone: string;
  address: string;

  fieldId: string;
  workerIds?: string[];
  scheduleIds?: string[];
  roomIds?: string[];
  serviceIds?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}
