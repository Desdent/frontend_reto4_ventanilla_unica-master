import { ActivitiesPaginationStructure } from '../../interfaces/activity/activities-pagination-structure.interface';
import { ActivityResponseDto } from './activity-response.dto';

export class ActivitiesPaginationDto {
  services: ActivityResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: ActivitiesPaginationStructure) {
    this.services = data.services;
    this.total = data.total;
    this.page = data.page;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
