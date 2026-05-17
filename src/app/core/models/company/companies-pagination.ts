import { CompaniesPaginationStructure } from '../../interfaces/company/companies-pagination.interface';
import { Company } from './company';

export class CompaniesPagination {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: CompaniesPaginationStructure) {
    this.companies = data.companies;
    this.total = data.total;
    this.page = data.limit;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
