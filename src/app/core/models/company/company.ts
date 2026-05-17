import { CompanyStructure } from '../../interfaces/company/company-structure.interface';

export class Company {
  constructor(data: CompanyStructure) {
    this.id = data.id;
    this.name = data.name;
    this.cif = data.cif;
    this.phone = data.phone;
    this.address = data.address;

    this.fieldId = data.fieldId;
    this.workerIds = data.workerIds;
    this.scheduleIds = data.scheduleIds;
    this.roomIds = data.roomIds;
    this.serviceIds = data.roomIds;

    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

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
