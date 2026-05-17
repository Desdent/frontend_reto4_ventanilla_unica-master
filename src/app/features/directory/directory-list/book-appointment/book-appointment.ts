import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CreateAppointmentRequest } from '../../../../core/interfaces/requests/create-appointment-request.interface';
import { PublicAppointment } from '../../../../core/models/appointment/public-appointment';
import { Schedule } from '../../../../core/models/schedule/schedule';
import { PublicWorker } from '../../../../core/models/user/public-worker';
import { Vacation } from '../../../../core/models/vacation/vacation';
import { AppointmentService } from '../../../../core/services/appointment/appointment.service';
import { ScheduleService } from '../../../../core/services/schedule/schedule.service';
import { UserService } from '../../../../core/services/users/users.service';
import { VacationService } from '../../../../core/services/vacation/vacation.service';
import { Utils } from '../../../../utils/logic/utility-functions';
import { CustomValidators } from '../../../../utils/validators/custom-validators.validator';
import { PublicUser } from '../../../../core/models/user/public-user';
import { CompleteUser } from '../../../../core/models/user/complete-user';
import { jwtDecode } from 'jwt-decode';
import { PublicActivityResponseDto } from '../../../../core/dto/activity/public-activity-response.dto';

@Component({
  selector: 'app-book-appointment',
  imports: [ReactiveFormsModule, DatePipe, DialogModule, ButtonModule, RouterLink],
  templateUrl: './book-appointment.html',
  styleUrl: './book-appointment.css',
})
export class BookAppointment {
  fb = inject(FormBuilder);
  userService = inject(UserService);
  vacationService = inject(VacationService);
  scheduleService = inject(ScheduleService);
  appointmentService = inject(AppointmentService);

  selectedActivity = signal<PublicActivityResponseDto | null>(null);
  schedule = signal<Schedule | null>(null);
  workers = signal<PublicWorker[] | null>(null);
  selectedWorker = signal<PublicWorker | null | undefined>(null);
  vacations = signal<Vacation[] | null>(null);
  sevenDaysOfWork = signal<string[] | null>(null);
  workdays = signal<string[] | undefined>([]);
  selectedDate = signal<string | null>(null);
  timesForActivity = signal<string[] | null>(null);
  rows = signal<number | null>(null);
  appointmentsForWorker = signal<PublicAppointment[] | null>(null);

  appointmentCreated = signal<boolean>(false);
  confirmationCode = signal<string | null>(null);
  error = signal<boolean>(false);

  token = signal<string | null>(null);
  user = signal<CompleteUser | null>(null);

  constructor() {
    // A effect is executed every time any of the signals inside of it changes
    effect(() => {
      const activity = this.selectedActivity();

      if (!activity) return;

      this.userService.pucliGetAllByServiceId(activity.id).subscribe({
        next: (resp: any) => this.workers.set(resp.data),
        error: (err) => console.error('Error looking for the service with id', activity.id),
      });
    });

    effect(() => {
      const user = this.user();

      const controlName = this.bookAppointmentForm.get('nameUser');
      const controlSurname1 = this.bookAppointmentForm.get('surname1User');
      const controlSurname2 = this.bookAppointmentForm.get('surname2User');
      const controlDni = this.bookAppointmentForm.get('dniUser');
      const controlEmail = this.bookAppointmentForm.get('emailUser');
      const controlPhone = this.bookAppointmentForm.get('phoneUser');

      if (user) {
        controlName?.disable({ emitEvent: false });
        controlSurname1?.disable({ emitEvent: false });
        controlSurname2?.disable({ emitEvent: false });
        controlDni?.disable({ emitEvent: false });
        controlEmail?.disable({ emitEvent: false });
        controlPhone?.disable({ emitEvent: false });
        this.bookAppointmentForm.patchValue({
          userId: user!.id,
        });
      }
    });
  }
  ngOnInit() {
    this.selectedActivity.set(
      localStorage.getItem('selectedActivity')
        ? JSON.parse(localStorage.getItem('selectedActivity')!)
        : null,
    );
    console.log('dds', this.selectedActivity());

    this.workdays.set(this.selectedActivity()?.workdays);

    if (this.selectedActivity()) {
      this.bookAppointmentForm.patchValue({
        serviceId: this.selectedActivity()!.id,
      });

      this.scheduleService.getActiveByCompanyId(this.selectedActivity()!.companyId!).subscribe({
        next: (resp: any) => {
          this.schedule.set(resp.data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }

    this.bookAppointmentForm.get('date')?.valueChanges.subscribe((value) => {
      console.log('value', value);
      let date: Date = new Date(value);
      // split by "T" because toIsoString separate date and time with that
      this.selectedDate.set(date.toLocaleDateString('en-CA'));

      console.log('iso', this.selectedDate());
      this.appointmentService.publicGetAllByWorker(this.selectedWorker()?.id!).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.appointmentsForWorker.set(resp.data);
          this.timesForActivity.set(
            this.calculateTimes(this.selectedActivity()!, this.appointmentsForWorker()!),
          );
        },
      });
    });

    this.token.set(localStorage.getItem('token'));
    if (this.token()) {
      let data: any = jwtDecode(this.token()!);

      this.userService.completeGetById(data.userId).subscribe({
        next: (resp: any) => {
          this.bookAppointmentForm.patchValue({
            nameUser: resp.data.name,
            surname1User: resp.data.surname1,
            surname2User: resp.data.surname2,
            dniUser: resp.data.dni,
            emailUser: resp.data.email,
            phoneUser: resp.data.phone,
          });

          this.user.set(resp.data);
        },
      });
    }
  }

  bookAppointmentForm = this.fb.nonNullable.group({
    nameUser: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1User: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname2User: ['', [Validators.maxLength(30)]],
    emailUser: ['', [Validators.required, Validators.email, CustomValidators.validateEmail]],
    dniUser: ['', [Validators.required, CustomValidators.validateDniNie]],
    phoneUser: ['', [Validators.required, CustomValidators.validatePhone]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    workerId: ['', [Validators.required]],
    userId: [''],
    counterId: ['', [Validators.required]],
    serviceId: [this.selectedActivity()?.id, [Validators.required]],
    extraTime: [this.selectedActivity()?.extraTime, []],
    appointmentDuration: [this.selectedActivity()?.appointmentDuration],
  });

  get emailControl() {
    return this.bookAppointmentForm.get('emailUser');
  }

  get nameControl() {
    return this.bookAppointmentForm.get('nameUser');
  }

  get surname1Control() {
    return this.bookAppointmentForm.get('surname1User');
  }

  get surname2Control() {
    return this.bookAppointmentForm.get('surname2User');
  }

  get phoneControl() {
    return this.bookAppointmentForm.get('phoneUser');
  }

  get dniControl() {
    return this.bookAppointmentForm.get('dniUser');
  }

  get dateControl() {
    return this.bookAppointmentForm.get('date');
  }

  get timeControl() {
    return this.bookAppointmentForm.get('time');
  }

  get userIdControl() {
    return this.bookAppointmentForm.get('userId');
  }

  get workerIdControl() {
    return this.bookAppointmentForm.get('workerId');
  }

  get counterIdControl() {
    return this.bookAppointmentForm.get('counterId');
  }

  get serviceIdControl() {
    return this.bookAppointmentForm.get('serviceId');
  }

  /**
   * This method is for the select worker input, it gets the element with the HtmlSelectElement, gives it the value of the input
   * gets the counter, stores it on the form, gets the vacation of that worker and use them to calculate the 7 days that will show to the user
   *
   * @param {Event} event
   */
  onOptionChangeWorker(event: Event) {
    const value: string = (event.target as HTMLSelectElement).value;
    this.bookAppointmentForm.patchValue({
      workerId: value,
    });
    const counter: string | undefined = this.workers()?.find((worker) => worker.id === value)
      ?.counterId
      ? this.workers()?.find((worker) => worker.id === value)?.counterId
      : undefined;

    this.selectedWorker.set(this.workers()!.find((worker) => worker.id == value));
    this.bookAppointmentForm.patchValue({
      counterId: counter,
    });

    this.vacationService.getAllApprovedByWorker(value).subscribe({
      next: (resp: any) => {
        this.vacations.set(resp.data);
        let dates: Date[] = Utils.CalculateWeekOfWork(
          this.schedule()!,
          this.vacations()!,
          this.selectedActivity()!,
        );
        let isoDates: string[] = dates.map((date) => date.toLocaleString('en-CA').split(',')[0]);
        this.sevenDaysOfWork.set(isoDates);
      },
    });
    this.bookAppointmentForm.patchValue({
      extraTime: this.selectedActivity()?.extraTime,
    });
    this.bookAppointmentForm.patchValue({
      appointmentDuration: this.selectedActivity()?.appointmentDuration,
    });
  }

  /**
   * This method is for the calculation of the times that the user will see, based on the entryTime, the exitTime and if the currentHour is not passed by X minutes
   * (being X the extraTime), then that time will be shown to the user even if it's passed the hour, to allow it to have a little bit late appointments as my teacher asked
   *
   * It compares the current hour and minute with the hour and minutes that wants to be added to the array, and also check the selected day is the same as today, in
   * which case is when it checks if the hour now is pass the hour trying to be added
   *
   * @param {PublicActivity} activity
   * @param {PublicAppointment[]} appointments
   * @returns {string[]}
   */
  calculateTimes(activity: PublicActivityResponseDto, appointments: PublicAppointment[]): string[] {
    const [hEntry, mEntry] = activity.entryTime!.split(':').map(Number);
    const [hExit, mExit] = activity.exitTime!.split(':').map(Number);

    console.log(activity.exitTime);

    let start = hEntry * 60 + mEntry;
    const end = hExit * 60 + mExit;

    const duration = activity.appointmentDuration!;

    const result: string[] = [];
    console.log(appointments);
    while (start <= end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;

      if (
        !appointments.some(
          (appointment) =>
            appointment.time ==
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        )
      ) {
        let now: Date = new Date();

        if (
          new Date(this.selectedDate()!).getFullYear() == now.getFullYear() &&
          new Date(this.selectedDate()!).getMonth() == now.getMonth() &&
          new Date(this.selectedDate()!).getDate() == now.getDate()
        ) {
          if (now.getHours() >= hours) {
            if (
              now.getHours() * 60 + now.getMinutes() - (hours * 60 + minutes) <
              this.selectedActivity()?.extraTime!
            ) {
              result.push(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
              );
            }
          } else {
            result.push(
              `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
            );
          }
        } else {
          result.push(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          );
        }
      }

      start += duration;
    }

    this.rows.set(result.length / 5);
    console.log(result);
    return result;
  }

  onSubmit() {
    if (this.bookAppointmentForm.invalid) {
      this.markAllAsTouched(this.bookAppointmentForm);
      return;
    }

    console.log(this.bookAppointmentForm.value);

    this.appointmentService
      .create(this.bookAppointmentForm.getRawValue() as CreateAppointmentRequest)
      .subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.confirmationCode.set(resp.data);
            this.appointmentCreated.set(true);
          } else {
            this.error.set(true);
          }
        },
      });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
