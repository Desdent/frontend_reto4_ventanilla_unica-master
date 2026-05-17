import { CounterResponseDto } from '../../dto/counter/counter-response.dto';
import { Coordinate } from '../../models/room/coordinate';

export interface RoomWithCountersResponseStructure {
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
}
