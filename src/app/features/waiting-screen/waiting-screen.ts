import { Component, signal } from '@angular/core';
import { AppointmentResponseDto } from '../../core/dto/appointment/appointment-response.dto';
import { connectToServer } from '../../utils/logic/socket-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-waiting-screen',
  imports: [],
  templateUrl: './waiting-screen.html',
  styleUrl: './waiting-screen.css',
})
export class WaitingScreen {
  constructor(private route: ActivatedRoute) {}

  queue = signal<AppointmentResponseDto[]>([]);
  id = signal<string>('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.id.set(id);

    const token = localStorage.getItem('token');

    if (token) {
      connectToServer(token, id, (data) => {
        console.log('QUEUE:', data);
        this.queue.set([...data]);
      });
    }
  }
}
