import { Floor } from '../../enums/Floor.enum';
import { CreateRoomRequestStructure } from '../../interfaces/room/create-room-request-structure.interface';
import { Coordinate } from '../../models/room/coordinate';
import { CreateCounterRequestDto } from '../counter/create-counter-request.dto';

export class CreateRoomRequestDto {
  number: number;
  floor: Floor;
  coordinates: Coordinate[];
  counters: CreateCounterRequestDto[] | undefined;
  companyId: string;
  serviceId: string;

  constructor(data: CreateRoomRequestStructure) {
    this.number = data.number;
    this.floor = data.floor;
    this.coordinates = data.coordinates;
    this.counters = data.counters;
    this.companyId = data.companyId;
    this.serviceId = data.serviceId;
  }
}
