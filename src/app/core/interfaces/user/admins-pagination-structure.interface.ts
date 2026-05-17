import { AdminTypeUser } from '../../dto/user/admin-type-user.dto';

export interface AdminsPaginationStructure {
  admins: AdminTypeUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
