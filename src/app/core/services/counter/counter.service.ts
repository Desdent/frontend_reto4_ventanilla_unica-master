import { Injectable } from '@angular/core';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { Observable } from 'rxjs';
import { CounterResponseWithRoomDto } from '../../dto/counter/counter-response-with-room.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private readonly http: HttpClient) {}

  private apiUrl: string = 'http://localhost:3000/api/counters';

  findAllEmptyByCompany(id: string): Observable<ApiResponseDto<CounterResponseWithRoomDto[]>> {
    return this.http.get<ApiResponseDto<CounterResponseWithRoomDto[]>>(
      `${this.apiUrl}/company/${id}/empty`,
    );
  }
}
