import { CoordinateStructure } from '../../interfaces/room/coordinate-structure.interface';

export class Coordinate {
  x: number;
  y: number;

  constructor(data: CoordinateStructure) {
    this.x = data.x;
    this.y = data.y;
  }
}
