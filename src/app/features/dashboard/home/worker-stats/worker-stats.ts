import { Component, Input, signal } from '@angular/core';
import { Payload } from '../../../../core/interfaces/payload/payload-structure.interface';
import { AppointmentService } from '../../../../core/services/appointment/appointment.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-worker-stats',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './worker-stats.html',
  styleUrl: './worker-stats.css',
})
export class WorkerStats {
  constructor(private appointmentService: AppointmentService) {}

  @Input() tokenSend!: string;
  payload = signal<Payload | null>(null);
  id = signal<string>('');
  companyId = signal<string | undefined>('');
  role = signal<string>('');

  countAppointments = signal<number>(0);

  ngOnInit() {
    if (this.tokenSend) {
      this.payload.set(jwtDecode(this.tokenSend!));
      this.id.set(this.payload()?.userId!);
      this.companyId.set(this.payload()?.companyId);
      this.role.set(this.payload()?.role!);

      this.loadData();
    }
  }

  loadData() {
    this.appointmentService
      .findAllByWorkerTodayPaginated(this.id(), 1, 2, 'asc', 'nameUser')
      .subscribe({
        next: (resp) => {
          this.countAppointments.set(resp.data?.total ?? 0);
        },
      });
  }
}
