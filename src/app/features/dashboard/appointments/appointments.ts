import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { jwtDecode } from 'jwt-decode';
import { TableModule } from 'primeng/table';
import { Roles } from '../../../core/enums/role.enum';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { PublicActivityResponseDto } from '../../../core/dto/activity/public-activity-response.dto';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { AppointmentService } from '../../../core/services/appointment/appointment.service';
import { AppointmentResponseDto } from '../../../core/dto/appointment/appointment-response.dto';

@Component({
  selector: 'app-appointments',
  imports: [TableModule, FullCalendarModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  constructor(
    private appointmentService: AppointmentService,
    private cd: ChangeDetectorRef,
  ) {}

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  startTime = signal<string | null>(null);
  endTime = signal<string | null>(null);
  activities = signal<PublicActivityResponseDto[] | null>(null);
  loading = signal(true);
  role = signal<string | null>(null);
  roleAdmin: string = Roles.ADMIN;
  appointments = signal<AppointmentResponseDto[] | null>(null);

  page = signal<number>(1);
  limit = signal<number>(5);
  orderBy = signal<string>('asc');
  orderField = signal<string>('nameUser');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'en',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    editable: false,
    events: [],
    height: 'auto',
    contentHeight: 'auto',
    expandRows: true,
  };

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));

    this.loadAppointments();
  }

  onSearch(event: any) {
    const value = event.target.value;

    this.searchTerm.set(value);
    this.page.set(1);

    if (value.trim().length > 0) {
      this.isSearching.set(true);
      this.loadSearch();
    } else {
      this.isSearching.set(false);
      this.loadAppointments();
    }
  }

  loadSearch() {
    this.loading.set(true);
    this.appointmentService
      .search(this.searchTerm(), this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.appointments.set(resp.data.appointments);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  loadAppointments() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);

      if (this.role() == this.roleAdmin) {
        this.loading.set(true);
        this.appointmentService
          .FindAllPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
          .subscribe({
            next: (resp) => {
              this.appointments.set(resp.data?.appointments!);
              console.log(resp.data?.appointments);
              this.totalPages.set(resp.data?.totalPages!);
              this.loading.set(false);
            },
          });
      } else {
        this.appointmentService.findAllByUserNonPaginated(this.id()!).subscribe({
          next: (resp: any) => {
            console.log(resp.data);
            if (this.role() == Roles.WORKER) {
              this.calendarOptions = {
                ...this.calendarOptions,
                events: resp.data.map((appointment: AppointmentResponseDto) => ({
                  title: `${appointment.nameUser} - ${appointment.time}`,
                  start: appointment.date,

                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444',
                  textColor: '#ffffff',
                })),
              };
              this.cd.detectChanges();
            } else {
              this.calendarOptions = {
                ...this.calendarOptions,
                events: resp.data.map((appointment: AppointmentResponseDto) => ({
                  title: `${appointment.time}`,
                  start: appointment.date,
                  extendedProps: { appointment },

                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444',
                  textColor: '#ffffff',
                })),
              };
              this.cd.detectChanges();
            }
          },
        });
      }
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadAppointments();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadAppointments();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadAppointments();
  }

  orderByAndReload(orderedBy: string) {
    console.log(this.orderField(), this.orderBy());
    if (this.orderField() == orderedBy) {
      switch (this.orderBy()) {
        case 'desc':
          this.orderBy.set('asc');
          break;
        default:
          this.orderBy.set('desc');
      }
    } else {
      this.orderBy.set('asc');
      this.page.set(1);
      this.orderField.set(orderedBy);
    }
    this.loadAppointments();
  }
}
