import { FieldStructure } from '../../interfaces/field/field-structure.interface';

export class Field {
  constructor(data: FieldStructure) {
    this.id = data.id;
    this.name = data.name;

    this.serviceIds = data.serviceIds;
    this.companyIds = data.companyIds;
  }

  id?: string;
  name: string;

  serviceIds?: string[];
  companyIds?: string[];
}
