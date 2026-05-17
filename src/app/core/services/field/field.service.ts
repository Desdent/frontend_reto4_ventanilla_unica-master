import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Field } from '../../models/field/field';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';

@Injectable({
  providedIn: 'root',
})
export class FieldService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/api/fields';

  getAll(): Observable<ApiResponseDto<Field[]>> {
    return this.http.get<ApiResponseDto<Field[]>>(this.apiUrl);
  }

  getById(): Observable<ApiResponseDto<Field>> {
    return this.http.get<ApiResponseDto<Field>>(this.apiUrl);
  }
}
