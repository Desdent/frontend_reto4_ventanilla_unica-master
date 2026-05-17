import { CreateCounterRequestDto } from '../../dto/counter/create-counter-request.dto';
import { Floor } from '../../enums/Floor.enum';

import { Coordinate } from '../../models/room/coordinate';

export interface CreateRoomRequestStructure {
  number: number;
  floor: Floor;
  coordinates: Coordinate[];
  counters: CreateCounterRequestDto[];
  companyId: string;
  serviceId: string;
}
