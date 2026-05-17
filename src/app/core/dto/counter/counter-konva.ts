import { CounterKonvaStructure } from '../../interfaces/counter/counter-konva-structure';

export class CounterKonva {
  id?: string;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  draggable: boolean;

  constructor(data: CounterKonvaStructure) {
    this.id = data.id;
    this.x = data.x;
    this.y = data.y;
    this.height = data.height;
    this.width = data.width;
    this.fill = data.fill;
    this.draggable = data.draggable;
  }
}
