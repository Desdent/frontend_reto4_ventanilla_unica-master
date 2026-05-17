import { RoomStructure } from '../../interfaces/room/room-structure.interface';

export class Room {
  id?: string;
  number: number;
  floor: number;

  counterIds?: string[];
  companyId: string;
  serviceId: string;

  constructor(data: RoomStructure) {
    this.id = data.id;
    this.number = data.number;
    this.floor = data.floor;

    this.counterIds = data.counterIds;
    this.companyId = data.companyId;
    this.serviceId = data.serviceId;
  }
}
