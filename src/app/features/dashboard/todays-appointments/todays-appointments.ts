import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/users/users.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentResponseDto } from '../../../core/dto/appointment/appointment-response.dto';
import { AppointmentService } from '../../../core/services/appointment/appointment.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppointmentStatus } from '../../../core/enums/appointment-status';
import { WorkerUpdateAppointment } from '../../../core/dto/appointment/worker-update-appointment-request';
import { formatCurrency, TitleCasePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-todays-appoitments',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, UpperCasePipe, TitleCasePipe],
  templateUrl: './todays-appointments.html',
  styleUrl: './todays-appointments.css',
})
export class TodaysAppoitments {
  constructor(
    private userService: UserService,
    private appointmentsService: AppointmentService,
    private router: Router,
  ) {}

  fb = inject(FormBuilder);

  appointments = signal<AppointmentResponseDto[] | null>(null);

  selectedAppointment = signal<AppointmentResponseDto | null>(null);
  selectedToChange = signal<AppointmentResponseDto | null>(null);
  payload = signal<Payload | null>(null);
  options = signal<AppointmentStatus[] | null>(null);

  loading = signal<boolean>(true);
  modalVisible = signal<boolean>(false);
  modalOkVisible = signal<boolean>(false);
  modalErrorVisible = signal<boolean>(false);
  modal2Visible = signal<boolean>(false);
  modal2OkVisible = signal<boolean>(false);
  modal2ErrorVisible = signal<boolean>(false);
  modal3Visible = signal<boolean>(false);
  modal3OkVisible = signal<boolean>(false);
  modal3ErrorVisible = signal<boolean>(false);
  modalConfirmVisible = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  page = signal<number>(1);
  limit = signal<number>(5);
  orderBy = signal<string>('asc');
  orderField = signal<string>('nameUser');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  async ngOnInit() {
    this.options.set(Object.values(AppointmentStatus));

    if (localStorage.getItem('token')) {
      await this.payload.set(jwtDecode(localStorage.getItem('token')!));
    }
    this.loadAppointments();
    console.log(this.appointments());
  }

  changeStatusForm = this.fb.nonNullable.group({
    status: [this.selectedAppointment()?.status, [Validators.required]],
    notes: [''],
  });

  get statusControl() {
    return this.changeStatusForm.get('status');
  }

  selectAppointment(appointment: AppointmentResponseDto) {
    this.selectedAppointment.set(appointment);
  }

  loadAppointments() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    this.loading.set(true);
    console.log(this.payload());
    this.appointmentsService
      .findAllByWorkerTodayPaginated(
        this.payload()?.userId!,
        this.page(),
        this.limit(),
        this.orderBy(),
        this.orderField(),
      )
      .subscribe({
        next: (resp: any) => {
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

    this.appointmentsService
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

  confirmAction(appointment: AppointmentResponseDto) {
    this.selectedToChange.set(appointment);
    this.modalConfirmVisible.set(true);
  }

  onSubmit() {
    const formValue = this.changeStatusForm.getRawValue();

    const appointment: WorkerUpdateAppointment = {
      status: formValue.status!,
      notes: formValue.notes,
    };

    this.appointmentsService.update(appointment, this.selectedAppointment()?.id!).subscribe({
      next: (resp) => {
        this.modalOkVisible.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.modalErrorVisible.set(true);
      },
    });
  }

  seeModal(selectedAppointment: AppointmentResponseDto) {
    this.changeStatusForm.patchValue({
      status: AppointmentStatus.RESERVED,
      notes: '',
    });
    this.selectedAppointment.set(selectedAppointment);
    this.modalVisible.set(true);
  }
}
