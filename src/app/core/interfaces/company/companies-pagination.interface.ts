import { Company } from '../../models/company/company';

export interface CompaniesPaginationStructure {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
