import { AdminViewWorkerResponseDto } from '../../dto/user/admin-view-worker-response.dto';

export interface WorkersPaginationStructure {
  workers: AdminViewWorkerResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
