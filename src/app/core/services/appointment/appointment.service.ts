import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicAppointment } from '../../models/appointment/public-appointment';
import { Injectable } from '@angular/core';
import { CreateAppointmentRequest } from '../../interfaces/requests/create-appointment-request.interface';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { AppointmentsPagination } from '../../dto/appointment/appointments-pagination.dto';

import { FormGroup } from '@angular/forms';
import { WorkerUpdateAppointment } from '../../dto/appointment/worker-update-appointment-request';
import { AppointmentsPaginatedDto } from '../../dto/appointment/appointments-paginated.dto';
import { AppointmentResponseDto } from '../../dto/appointment/appointment-response.dto';
import { FullAppointmentResponseDto } from '../../dto/appointment/full-appointment-response.dto';
import { UpdateAppointmentRequestDto } from '../../dto/appointment/update-appointment-request.dto';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl: string = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) {}

  // Used to calculate the available times, minimal data
  publicGetAllByWorker(workerId: string): Observable<ApiResponseDto<PublicAppointment[]>> {
    return this.http.get<ApiResponseDto<PublicAppointment[]>>(
      `${this.apiUrl}/public/worker/${workerId}`,
    );
  }

  create(data: CreateAppointmentRequest): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  findAll() {
    return this.http.get<ApiResponseDto<AppointmentResponseDto[]>>(`${this.apiUrl}/superadmin`);
  }

  // For the calendars
  findAllByUserNonPaginated(id: string): Observable<ApiResponseDto<AppointmentResponseDto[]>> {
    return this.http.get<ApiResponseDto<AppointmentResponseDto[]>>(`${this.apiUrl}/self`);
  }

  findByCode(code: string): Observable<ApiResponseDto<FullAppointmentResponseDto>> {
    return this.http.get<ApiResponseDto<FullAppointmentResponseDto>>(
      `${this.apiUrl}/confirmation-code/${code}`,
    );
  }

  findAllByWorkerTodayPaginated(
    id: string,
    page: number,
    limit: number,
    orderBy: string = 'asc',
    orderField: string = 'name',
  ): Observable<ApiResponseDto<AppointmentsPagination>> {
    return this.http.get<ApiResponseDto<AppointmentsPagination>>(
      `${this.apiUrl}/paginated/today/${id}`,
      {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          orderBy,
          orderField,
        },
      },
    );
  }

  // Reusable for all users checking the role on the backend
  FindAllPaginated(
    page: number,
    limit: number,
    orderBy: string = 'asc',
    orderField: string = 'name',
  ): Observable<ApiResponseDto<AppointmentsPaginatedDto>> {
    return this.http.get<ApiResponseDto<AppointmentsPaginatedDto>>(this.apiUrl, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        orderField,
      },
    });
  }

  FindAppointmentsNext7Days(): Observable<ApiResponseDto<AppointmentResponseDto[]>> {
    return this.http.get<ApiResponseDto<AppointmentResponseDto[]>>(
      `${this.apiUrl}/self/next-seven-days`,
    );
  }

  search(
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: {
        term,
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  update(data: WorkerUpdateAppointment, id: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
  }

  updateByCode(data: UpdateAppointmentRequestDto, code: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/code/${code}`, data);
  }

  confirmArrival(code: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/confirm/${code}`, {});
  }

  deleteByCode(code: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/confirmation-code/${code}`);
  }
}
