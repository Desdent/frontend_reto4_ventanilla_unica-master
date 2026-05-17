import { CreateCounterRequestStructure } from '../../interfaces/counter/create-counter-request-structure';

export class CreateCounterRequestDto {
  number: number;
  x: number;
  y: number;
  height: number;
  width: number;

  constructor(data: CreateCounterRequestStructure) {
    this.number = data.number;
    this.x = data.x;
    this.y = data.y;
    this.height = data.height;
    this.width = data.width;
  }
}
