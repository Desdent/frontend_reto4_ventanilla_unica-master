import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../../models/room/room';
import { Floor } from '../../models/floor/floor';
import { ApiResponseDto } from '../../dto/api-response/api-response.dto';
import { RoomResponseDto } from '../../dto/room/room-response.dto';
import { CreateActivityRequestDto } from '../../dto/activity/create-activity-request.dto';
import { RoomWitherCountersResponseDto } from '../../dto/room/room-with-counters.response.dto';
import { CreateRoomRequestDto } from '../../dto/room/create-room-request.dto';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl: string = 'http://localhost:3000/api/rooms';

  constructor(private http: HttpClient) {}

  create(data: CreateRoomRequestDto): Observable<ApiResponseDto<void>> {
    return this.http.post<ApiResponseDto<void>>(this.apiUrl, data);
  }

  getAllByCompanyId(id: string): Observable<ApiResponseDto<RoomResponseDto[]>> {
    return this.http.get<ApiResponseDto<RoomResponseDto[]>>(`${this.apiUrl}/company/${id}`);
  }

  getAllEmptyByCompanyId(id: string): Observable<ApiResponseDto<RoomResponseDto[]>> {
    return this.http.get<ApiResponseDto<RoomResponseDto[]>>(`${this.apiUrl}/company/${id}/empty`);
  }

  getAllWithCountersByCompanyId(
    id: string,
  ): Observable<ApiResponseDto<RoomWitherCountersResponseDto[]>> {
    return this.http.get<ApiResponseDto<RoomWitherCountersResponseDto[]>>(
      `${this.apiUrl}/company/${id}/complete`,
    );
  }

  getAllFloors(): Observable<ApiResponseDto<number[]>> {
    return this.http.get<ApiResponseDto<number[]>>(`${this.apiUrl}/floors`);
  }

  update(data: CreateRoomRequestDto, id: string): Observable<ApiResponseDto<void>> {
    return this.http.patch<ApiResponseDto<void>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponseDto<void>> {
    return this.http.delete<ApiResponseDto<void>>(`${this.apiUrl}/${id}`);
  }
}
