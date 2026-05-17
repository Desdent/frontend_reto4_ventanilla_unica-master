export interface CounterResponseWithRoomStructure {
  id?: string;
  number: number;
  x: number;
  y: number;
  height: number;
  width: number;

  roomId: string;
  roomNumber: number;
}
