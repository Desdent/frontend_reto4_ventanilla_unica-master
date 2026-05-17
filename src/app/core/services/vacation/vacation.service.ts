import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vacation } from '../../models/vacation/vacation';
import { HttpClient } from '@angular/common/http';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { VacationsPaginationDto } from '../../dto/vacation/vacation-pagination.dto';
import { CreateVacationRequestDto } from '../../dto/vacation/create-vacation-request.dto';

@Injectable({
  providedIn: 'root',
})
export class VacationService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/api/vacations';

  create(data: CreateVacationRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  update(id: string, data: CreateVacationRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
  }

  getAllPaginated(
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<VacationsPaginationDto>> {
    return this.http.get<ApiResponseDto<VacationsPaginationDto>>(`${this.apiUrl}`, {
      params: {
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  getAllApprovedByWorker(id: string): Observable<Vacation[]> {
    return this.http.get<Vacation[]>(`${this.apiUrl}/worker/${id}`);
  }

  delete(id: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`);
  }

  searchTermInVactions(
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<VacationsPaginationDto>> {
    return this.http.get<ApiResponseDto<VacationsPaginationDto>>(`${this.apiUrl}/search`, {
      params: {
        term,
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }
}
