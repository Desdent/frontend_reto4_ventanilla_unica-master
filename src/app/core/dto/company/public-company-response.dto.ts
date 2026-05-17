import { PublicCompanyResponseStructure } from '../../interfaces/company/public-company-response-structure.interface';

export class PublicCompanyResponseDto {
  name: string;
  cif: string;
  phone: string;
  address: string;

  constructor(data: PublicCompanyResponseStructure) {
    this.name = data.name;
    this.cif = data.cif;
    this.phone = data.phone;
    this.address = data.address;
  }
}
