import { FloorStructure } from '../../interfaces/floor/floor-structure.interface';

export class Floor {
  number: number;

  constructor(data: FloorStructure) {
    this.number = data.name;
  }
}
