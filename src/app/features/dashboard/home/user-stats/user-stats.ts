import { Component, Input, signal } from '@angular/core';
import { Payload } from '../../../../core/interfaces/payload/payload-structure.interface';
import { jwtDecode } from 'jwt-decode';
import { AppointmentService } from '../../../../core/services/appointment/appointment.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-stats',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-stats.html',
  styleUrl: './user-stats.css',
})
export class UserStats {
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
    this.appointmentService.FindAppointmentsNext7Days().subscribe({
      next: (resp) => {
        this.countAppointments.set(resp.data?.length ?? 0);
      },
    });
  }
}
