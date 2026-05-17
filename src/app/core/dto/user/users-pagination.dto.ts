import { UserResponseDto } from '../../dto/user/user-response.dto';
import { UsersPaginationStructure } from '../../interfaces/user/users-pagination-structure.interface';

export class UsersPaginationDto {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: UsersPaginationStructure) {
    this.users = data.users;
    this.total = data.total;
    this.page = data.page;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
