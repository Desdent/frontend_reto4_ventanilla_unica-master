import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../../core/interfaces/payload/payload-structure.interface';
import { Roles } from '../../core/enums/role.enum';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MenubarModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  items: MenuItem[] | undefined;
  token = signal<string | null>(null);
  role = signal<string | null>(null);

  ngOnInit() {
    this.token.set(localStorage.getItem('token') ? localStorage.getItem('token') : null);

    if (this.token()) {
      let payload: Payload = jwtDecode(this.token()!);
      this.role.set(payload.role);
    }

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: 'home',
      },
    ];

    if (this.role() == Roles.WORKER)
      this.items.push(
        { label: 'Today', icon: 'pi pi-star', routerLink: 'today' },
        { label: 'My Days', icon: 'pi pi-sun', routerLink: 'holidays' },
      );

    if (this.role() != Roles.SUPERADMIN)
      this.items.push({
        label: 'Appointments',
        icon: 'pi pi-calendar',
        routerLink: 'appointments',
      });

    if (this.role() == Roles.SUPERADMIN) {
      this.items.push(
        {
          label: 'Users',
          icon: 'pi pi-user',
          routerLink: 'users',
        },
        {
          label: 'Companies',
          icon: 'pi pi-building',
          routerLink: 'companies',
        },
        {
          label: 'Admins',
          icon: 'pi pi-briefcase',
          routerLink: 'admins',
        },
      );
    }

    if (this.role() == Roles.ADMIN) {
      this.items.push(
        {
          label: 'Data',
          icon: 'pi pi-file',
          items: [
            {
              label: 'My Data',
              icon: 'pi pi-file',
              routerLink: 'my-data',
            },
            {
              label: 'Company Data',
              icon: 'pi pi-file',
              routerLink: 'company-data',
            },
          ],
        },

        { label: 'Employees', icon: 'pi pi-briefcase', routerLink: 'workers' },
        { label: 'Holidays Requests', icon: 'pi pi-sun', routerLink: 'holidays' },
        { label: 'Schedules', icon: 'pi pi-calendar', routerLink: 'schedules' },
        { label: 'Services', icon: 'pi pi-align-justify', routerLink: 'activities' },

        { label: 'Rooms', icon: 'pi pi-building-columns', routerLink: 'rooms' },
      );
    } else {
      this.items.push({
        label: 'My Data',
        icon: 'pi pi-file',
        routerLink: 'my-data',
      });
    }
  }
}
