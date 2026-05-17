import { HttpClient } from '@angular/common/http';
import { Schedule } from '../../models/schedule/schedule';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { ScheduleResponseDto } from '../../models/schedule/schedule-response.dto';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/api/schedules';

  getActiveByCompanyId(id: string): Observable<ApiResponseDto<Schedule>> {
    return this.http.get<ApiResponseDto<Schedule>>(`${this.apiUrl}/company/${id}`);
  }

  getAllByCompany(id: string): Observable<ApiResponseDto<ScheduleResponseDto[]>> {
    return this.http.get<ApiResponseDto<ScheduleResponseDto[]>>(this.apiUrl);
  }

  create(data: ScheduleResponseDto): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  update(id: string, data: ScheduleResponseDto): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`);
  }

  activate(id: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/activate/${id}`, {});
  }
}
