import { VacationResponseDto } from '../../dto/vacation/vacation-response.dto';

export interface VactionsPaginationStructure {
  vacations: VacationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
