import { AppointmentsPaginatedData } from '../../interfaces/appointment/appointments-paginated.data.interface';
import { AppointmentsPagination } from './appointments-pagination.dto';
import { AppointmentResponseDto } from './appointment-response.dto';

export class AppointmentsPaginatedDto {
  appointments: AppointmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: AppointmentsPaginatedData) {
    this.appointments = data.appointments;
    this.total = data.total;
    this.page = data.page;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
