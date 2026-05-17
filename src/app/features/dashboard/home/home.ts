import { Component, Input, signal } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { TitleCasePipe } from '@angular/common';
import { SuperAdminStats } from './super-admin-stats/super.admin-stats';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { Roles } from '../../../core/enums/role.enum';
import { AdminStats } from './admin-stats/admin-stats';
import { UserStats } from './user-stats/user-stats';
import { WorkerStats } from './worker-stats/worker-stats';

@Component({
  selector: 'app-home',
  imports: [TitleCasePipe, SuperAdminStats, AdminStats, WorkerStats, UserStats],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  name = signal<string | null>(null);
  token = signal<string>('');
  role = signal<string>('');
  Roles = Roles;

  ngOnInit() {
    this.token.set(localStorage.getItem('token') ?? '');
    if (this.token()) {
      const payload: Payload = jwtDecode(this.token()!);

      this.name.set(payload.userName);

      this.role.set(payload.role);
    }
  }
}
