import { RoomWithCountersResponseStructure } from '../../interfaces/room/room-with-counters-response-structure.interface';
import { Coordinate } from '../../models/room/coordinate';
import { CounterResponseDto } from '../counter/counter-response.dto';

export class RoomWitherCountersResponseDto {
  id: string;
  number: number;
  floor: number;
  counterIds?: string[];
  counters?: number[];
  companyId: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  counterObjects: CounterResponseDto[];
  coordinates: Coordinate[];

  constructor(data: RoomWithCountersResponseStructure) {
    this.id = data.id;
    this.number = data.number;
    this.floor = data.floor;
    this.counterIds = data.counterIds;
    this.counters = data.counters;
    this.companyId = data.companyId;
    this.companyName = data.companyName;
    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;
    this.counterObjects = data.counterObjects;
    this.coordinates = data.coordinates;
  }
}
