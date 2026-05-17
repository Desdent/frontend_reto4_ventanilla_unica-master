import { Coordinate } from '../../models/room/coordinate';

export interface RoomResponseStructure {
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
}
