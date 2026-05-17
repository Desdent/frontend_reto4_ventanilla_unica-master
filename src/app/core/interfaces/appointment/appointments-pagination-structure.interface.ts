import { AppointmentResponseDto } from '../../dto/appointment/appointment-response.dto.js';

export interface AppointmentsPaginationStructure {
  appointments: AppointmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
