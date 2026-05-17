import { CounterResponseWithRoomStructure } from '../../interfaces/counter/counter-response-with-room-structure.interface';

export class CounterResponseWithRoomDto {
  id?: string;
  number: number;
  x: number;
  y: number;
  height: number;
  width: number;

  roomId: string;
  roomNumber: number;

  constructor(data: CounterResponseWithRoomStructure) {
    this.id = data.id;
    this.number = data.number;
    this.x = data.x;
    this.y = data.y;
    this.height = data.height;
    this.width = data.width;
    this.roomId = data.roomId;
    this.roomNumber = data.roomNumber;
  }
}
