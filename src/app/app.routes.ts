import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Appointments } from './features/dashboard/appointments/appointments';
import { Companies } from './features/dashboard/companies/companies';
import { Dashboard } from './features/dashboard/dashboard';

import { BookAppointment } from './features/directory/directory-list/book-appointment/book-appointment';
import { DirectoryList } from './features/directory/directory-list/directory-list';
import { MainLayout } from './layout/main-layout/main-layout';

import { Roles } from './core/enums/role.enum';
import { guestGuard } from './core/guards/guest-guard/guest-guard';
import { isAuthGuard } from './core/guards/is-auth-guard/is-auth-guard';
import { roleGuard } from './core/guards/role-guard/role-guard-guard';
import { Admins } from './features/dashboard/admins-company/admins';
import { TodaysAppoitments } from './features/dashboard/todays-appointments/todays-appointments';
import { Workers } from './features/dashboard/workers/workers';
import { Holidays } from './features/dashboard/holidays/holidays';
import { Schedules } from './features/dashboard/schedules/schedules';
import { Activities } from './features/dashboard/activities/activities';
import { Rooms } from './features/dashboard/rooms/rooms';
import { MyData } from './features/dashboard/my-data/my-data';
import { CompanyData } from './features/dashboard/company-data/company-data';
import { Users } from './features/dashboard/users/users';
import { ConfirmArrive } from './features/confirm-arrive/confirm-arrive';
import { WaitingScreen } from './features/waiting-screen/waiting-screen';
import { FindAppointment } from './features/find-appointment/find-appointment';
import { Home } from './features/dashboard/home/home';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'directory', pathMatch: 'full' },

      {
        path: 'directory',
        children: [
          { path: '', component: DirectoryList },
          { path: 'book-appointment', component: BookAppointment },
        ],
      },
      {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [isAuthGuard],

        children: [
          { path: '', component: Home },
          { path: 'home', component: Home },
          {
            path: 'appointments',
            component: Appointments,
            canActivate: [roleGuard],
            data: { roles: [Roles.ADMIN, Roles.WORKER, Roles.BASEUSER] },
          },
          {
            path: 'today',
            component: TodaysAppoitments,
            canActivate: [roleGuard],
            data: { roles: [Roles.WORKER] },
          },
          {
            path: 'users',
            component: Users,
            canActivate: [roleGuard],
            data: { roles: [Roles.SUPERADMIN] },
          },
          {
            path: 'workers',
            component: Workers,
            canActivate: [roleGuard],
            data: { roles: [Roles.ADMIN] },
          },
          {
            path: 'companies',
            component: Companies,
            canActivate: [roleGuard],
            data: { roles: [Roles.SUPERADMIN] },
          },
          {
            path: 'admins',
            component: Admins,
            canActivate: [roleGuard],
            data: { roles: [Roles.SUPERADMIN] },
          },
          {
            path: 'holidays',
            component: Holidays,
            canActivate: [roleGuard],
            data: {
              roles: [Roles.ADMIN, Roles.WORKER],
            },
          },
          {
            path: 'schedules',
            component: Schedules,
            canActivate: [roleGuard],
            data: {
              roles: [Roles.ADMIN],
            },
          },
          {
            path: 'activities',
            component: Activities,
            canActivate: [roleGuard],
            data: {
              roles: [Roles.ADMIN],
            },
          },
          {
            path: 'rooms',
            component: Rooms,
            canActivate: [roleGuard],
            data: {
              roles: [Roles.ADMIN],
            },
          },
          {
            path: 'my-data',
            component: MyData,
          },
          {
            path: 'company-data',
            component: CompanyData,
            data: {
              roles: [Roles.ADMIN],
            },
          },
        ],
      },
    ],
  },

  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'confirm', component: ConfirmArrive },
  { path: 'waiting/:id', component: WaitingScreen },
  {
    path: 'find-appointment',
    component: FindAppointment,
  },

  { path: '**', redirectTo: 'directory' },
];
