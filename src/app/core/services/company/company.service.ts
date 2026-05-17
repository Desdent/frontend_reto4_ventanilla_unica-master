import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../../models/company/company';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { CreateCompanyRequest } from '../../interfaces/requests/create-company-request.interface';
import { CompaniesPagination } from '../../models/company/companies-pagination';
import { PublicCompanyResponseDto } from '../../dto/company/public-company-response.dto';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/api/companies';

  create(data: CreateCompanyRequest): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  findAllPaginated(
    page: number,
    limit: number,
    orderBy: string = 'asc',
    orderField: string = 'name',
  ): Observable<ApiResponseDto<CompaniesPagination>> {
    return this.http.get<ApiResponseDto<CompaniesPagination>>(`${this.apiUrl}/paginated`, {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        orderBy,
        orderField,
      },
    });
  }

  findAll(): Observable<ApiResponseDto<PublicCompanyResponseDto[]>> {
    return this.http.get<ApiResponseDto<PublicCompanyResponseDto[]>>(this.apiUrl);
  }

  findById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  publicFindById(id: string): Observable<ApiResponseDto<PublicCompanyResponseDto>> {
    return this.http.get<ApiResponseDto<PublicCompanyResponseDto>>(`${this.apiUrl}/public/${id}`);
  }

  update(id: string, data: PublicCompanyResponseDto): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
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

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
