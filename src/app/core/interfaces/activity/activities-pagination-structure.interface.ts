import { ActivityResponseDto } from '../../dto/activity/activity-response.dto';

export interface ActivitiesPaginationStructure {
  services: ActivityResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
