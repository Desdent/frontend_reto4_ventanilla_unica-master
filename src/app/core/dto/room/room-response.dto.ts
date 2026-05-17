import { RoomResponseStructure } from '../../interfaces/room/room-response-structure.interface';
import { Coordinate } from '../../models/room/coordinate';

export class RoomResponseDto {
  id: string;
  number: number;
  floor: number;
  counterIds?: string[];
  counters?: number[];
  companyId: string;
  companyName: string;
  serviceId: string;
  serviceName: string;
  coordinates: Coordinate[];

  constructor(data: RoomResponseStructure) {
    this.id = data.id;
    this.number = data.number;
    this.floor = data.floor;
    this.counterIds = data.counterIds;
    this.counters = data.counters;
    this.companyId = data.companyId;
    this.companyName = data.companyName;
    this.serviceId = data.serviceId;
    this.serviceName = data.serviceName;
    this.coordinates = data.coordinates;
  }
}
