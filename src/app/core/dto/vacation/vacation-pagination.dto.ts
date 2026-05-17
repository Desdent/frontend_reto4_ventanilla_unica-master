import { VactionsPaginationStructure } from '../../interfaces/vacation/vacations-pagination.structure';
import { VacationResponseDto } from './vacation-response.dto';

export class VacationsPaginationDto {
  vacations: VacationResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: VactionsPaginationStructure) {
    ((this.vacations = data.vacations),
      (this.total = data.total),
      (this.page = data.page),
      (this.limit = data.limit),
      (this.totalPages = data.totalPages));
  }
}
