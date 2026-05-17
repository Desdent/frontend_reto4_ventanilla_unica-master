import { AdminsPaginationStructure } from '../../interfaces/user/admins-pagination-structure.interface';
import { AdminTypeUser } from './admin-type-user.dto';

export class AdminsPagination {
  admins: AdminTypeUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: AdminsPaginationStructure) {
    this.admins = data.admins;
    this.total = data.total;
    this.page = data.limit;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
