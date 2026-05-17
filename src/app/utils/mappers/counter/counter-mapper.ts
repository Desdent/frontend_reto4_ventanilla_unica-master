import { CounterKonva } from '../../../core/dto/counter/counter-konva';
import { CounterResponseDto } from '../../../core/dto/counter/counter-response.dto';

export class CounterMapper {
  static fromDtoToKonva(room: CounterResponseDto): CounterKonva {
    const counter: CounterKonva = {
      ...room,
      fill: 'grey',
      draggable: true,
      id: room.id!,
    };

    return counter;
  }
}
