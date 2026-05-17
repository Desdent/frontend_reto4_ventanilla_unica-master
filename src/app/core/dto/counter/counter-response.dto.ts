import { CounterResponseInterface } from '../../interfaces/counter/counter-response-structure.interface';

export class CounterResponseDto {
  id?: string;
  number: number;
  x: number;
  y: number;
  height: number;
  width: number;

  workerId?: string;
  workerName?: string;
  workerSurname1?: string;

  constructor(data: CounterResponseInterface) {
    this.id = data.id;
    this.number = data.number;
    this.x = data.x;
    this.y = data.y;
    this.height = data.height;
    this.width = data.width;
    this.workerId = data.workerId;
    this.workerName = data.workerName;
    this.workerSurname1 = data.workerSurname1;
  }
}
