import { AdminViewWorkerResponseDto } from '../../dto/user/admin-view-worker-response.dto';
import { WorkersPaginationStructure } from '../../interfaces/user/workers-pagination-structure.interface';

export class WorkersPaginationResponseDto {
  workers: AdminViewWorkerResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: WorkersPaginationStructure) {
    ((this.workers = data.workers),
      (this.total = data.total),
      (this.page = data.page),
      (this.limit = data.limit),
      (this.totalPages = data.totalPages));
  }
}
