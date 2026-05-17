import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteUser } from '../../models/user/complete-user';
import { AdminTypeUser } from '../../dto/user/admin-type-user.dto';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { CreateAdminRequest } from '../../dto/user/create-admin-request.dto';
import { PublicUser } from '../../models/user/public-user';
import { WorkersPaginationResponseDto } from '../../dto/user/workers-pagination.dto';
import { PublicUserResponseDto } from '../../dto/user/public-user-response.dto';
import { PublicSelfUpdateRequestDto } from '../../dto/user/self-update-request.dto';
import { UpdatePasswordRequestDto } from '../../dto/user/update-password-request.dto';
import { UsersPaginationDto } from '../../dto/user/users-pagination.dto';
import { CreateUserRequestDto } from '../../dto/user/create-user-request.dto';
import { UserResponseDto } from '../../dto/user/user-response.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  createAdmin(data: CreateAdminRequest): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(`${this.apiUrl}/admin`, data);
  }

  createWorker(data: CreateAdminRequest): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(`${this.apiUrl}/worker`, data);
  }

  createUser(data: CreateUserRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(`${this.apiUrl}/user`, data);
  }

  getAll() {
    return this.http.get<ApiResponseDto<UserResponseDto[]>>(this.apiUrl);
  }

  pucliGetAllByServiceId(serviceId: string): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  publicGetMyData(): Observable<PublicUserResponseDto> {
    return this.http.get<PublicUserResponseDto>(`${this.apiUrl}/public/self`);
  }

  completeGetById(userId: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/${userId}`);
  }

  getAllAdmins(): Observable<ApiResponseDto<AdminTypeUser[]>> {
    return this.http.get<ApiResponseDto<AdminTypeUser[]>>(`${this.apiUrl}/admins`);
  }

  getAllAdminsPaginated(
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<AdminTypeUser[]>> {
    return this.http.get<ApiResponseDto<AdminTypeUser[]>>(`${this.apiUrl}/admins/paginated`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        orderField,
      },
    });
  }

  getAllUsersPaginated(
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<UsersPaginationDto>> {
    return this.http.get<ApiResponseDto<UsersPaginationDto>>(`${this.apiUrl}/users/paginated`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        orderField,
      },
    });
  }

  updateWorker(id: string, data: CreateAdminRequest): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, data);
  }

  updateSelf(data: PublicSelfUpdateRequestDto): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/self`, data);
  }

  updatePass(data: UpdatePasswordRequestDto): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/self/password`, data);
  }

  // In no case I'm gonna need workers non paginated but in order to follow the same structure for routes I'll keep the "/paginated"
  getAllWorkersPaginated(
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<WorkersPaginationResponseDto>> {
    return this.http.get<ApiResponseDto<WorkersPaginationResponseDto>>(
      `${this.apiUrl}/workers/paginated`,
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

  delete(id: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`);
  }

  searchAdmins(
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admins/search`, {
      params: {
        term,
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  searchUsers(
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<ApiResponseDto<UsersPaginationDto>> {
    return this.http.get<ApiResponseDto<UsersPaginationDto>>(`${this.apiUrl}/users/search`, {
      params: {
        term,
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  searchEmployees(
    term: string,
    page: number,
    limit: number,
    orderBy: string,
    orderField: string,
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workers/search`, {
      params: {
        term,
        page,
        limit,
        orderBy,
        orderField,
      },
    });
  }

  banUnban(id: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/banUnban/${id}`, {});
  }
}
