import { AppointmentsPaginationStructure } from '../../interfaces/appointment/appointments-pagination-structure.interface';
import { AppointmentResponseStructure } from '../../interfaces/appointment/appointment-response-structure.interface';
import { AppointmentResponseDto } from './appointment-response.dto';

export class AppointmentsPagination {
  appointments: AppointmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data: AppointmentsPaginationStructure) {
    this.appointments = data.appointments;
    this.total = data.total;
    this.page = data.limit;
    this.limit = data.limit;
    this.totalPages = data.totalPages;
  }
}
