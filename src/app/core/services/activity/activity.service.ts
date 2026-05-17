import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicActivityResponseDto } from '../../dto/activity/public-activity-response.dto';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { ActivitiesPaginationDto } from '../../dto/activity/activities-pagination.dto';
import { ActivityResponseDto } from '../../dto/activity/activity-response.dto';
import { CreateActivityRequestDto } from '../../dto/activity/create-activity-request.dto';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl: string = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) {}

  create(data: CreateActivityRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  getById(id: string): Observable<ApiResponseDto<PublicActivityResponseDto>> {
    return this.http.get<ApiResponseDto<PublicActivityResponseDto>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ApiResponseDto<PublicActivityResponseDto[]>> {
    return this.http.get<ApiResponseDto<PublicActivityResponseDto[]>>(this.apiUrl);
  }

  getAllPaginated(
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<ActivitiesPaginationDto>> {
    return this.http.get<ApiResponseDto<ActivitiesPaginationDto>>(`${this.apiUrl}/paginated`, {
      params: {
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  getAllByFloor(floor: number): Observable<ApiResponseDto<PublicActivityResponseDto[]>> {
    return this.http.get<ApiResponseDto<PublicActivityResponseDto[]>>(
      `${this.apiUrl}/floor/${floor}`,
    );
  }

  getAllPaginatedByFloor(
    floor: number,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<ActivitiesPaginationDto>> {
    return this.http.get<ApiResponseDto<ActivitiesPaginationDto>>(
      `${this.apiUrl}/paginated/${floor}`,
      {
        params: {
          page,
          limit,
          orderBy,
          orderField,
        },
      },
    );
  }

  getAllByCompany(id: string): Observable<ApiResponseDto<ActivityResponseDto[]>> {
    return this.http.get<ApiResponseDto<ActivityResponseDto[]>>(`${this.apiUrl}/company/${id}`);
  }

  getAllByCompanyPaginated(
    id: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<ActivitiesPaginationDto>> {
    return this.http.get<ApiResponseDto<ActivitiesPaginationDto>>(
      `${this.apiUrl}/company/${id}/paginated`,
      {
        params: {
          page,
          limit,
          orderBy,
          orderField,
        },
      },
    );
  }

  update(id: string, data: CreateActivityRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
  }

  search(term: string, floor: number = 0): Observable<ApiResponseDto<PublicActivityResponseDto[]>> {
    return this.http.get<ApiResponseDto<PublicActivityResponseDto[]>>(
      `${this.apiUrl}/search?term=${term}&floor=${floor}`,
    );
  }

  searchInCompany(
    id: string,
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<ActivitiesPaginationDto>> {
    return this.http.get<ApiResponseDto<ActivitiesPaginationDto>>(
      `${this.apiUrl}/company/${id}/search`,
      {
        params: {
          term,
          page,
          limit,
          orderBy,
          orderField,
        },
      },
    );
  }

  pucliGetAllByServiceId(
    serviceId: string,
  ): Observable<ApiResponseDto<PublicActivityResponseDto[]>> {
    return this.http.get<ApiResponseDto<PublicActivityResponseDto[]>>(
      `${this.apiUrl}/service/${serviceId}`,
    );
  }

  delete(id: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
