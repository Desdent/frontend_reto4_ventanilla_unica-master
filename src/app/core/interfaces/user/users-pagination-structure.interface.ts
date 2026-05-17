import { UserResponseDto } from '../../dto/user/user-response.dto';

export interface UsersPaginationStructure {
  users: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
