import { AppointmentResponseDto } from '../../dto/appointment/appointment-response.dto';

export interface AppointmentsPaginatedData {
  appointments: AppointmentResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
