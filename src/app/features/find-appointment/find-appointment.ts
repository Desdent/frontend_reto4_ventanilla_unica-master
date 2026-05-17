import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppointmentService } from '../../core/services/appointment/appointment.service';
import { ScheduleService } from '../../core/services/schedule/schedule.service';
import { VacationService } from '../../core/services/vacation/vacation.service';

import { Schedule } from '../../core/models/schedule/schedule';
import { Vacation } from '../../core/models/vacation/vacation';
import { PublicAppointment } from '../../core/models/appointment/public-appointment';
import { AppointmentResponseDto } from '../../core/dto/appointment/appointment-response.dto';
import { FullAppointmentResponseDto } from '../../core/dto/appointment/full-appointment-response.dto';
import { Utils } from '../../utils/logic/utility-functions';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CustomValidators } from '../../utils/validators/custom-validators.validator';
import { UpdateAppointmentRequestDto } from '../../core/dto/appointment/update-appointment-request.dto';
import { JspdfService } from '../../utils/jspdf/jspdf.service';
import { PublicActivityResponseDto } from '../../core/dto/activity/public-activity-response.dto';
import { ActivityService } from '../../core/services/activity/activity.service';

@Component({
  selector: 'app-find-appointment',
  imports: [ReactiveFormsModule, DatePipe, DialogModule, ButtonModule],
  templateUrl: './find-appointment.html',
})
export class FindAppointment {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly scheduleService: ScheduleService,
    private readonly vacationService: VacationService,
    private readonly activityService: ActivityService,
    private readonly pdfService: JspdfService,
  ) {}

  fb = inject(FormBuilder);

  seeAppointment = signal<boolean>(false);
  modalUpdated = signal<boolean>(false);
  modalError = signal<boolean>(false);
  modalConfirm = signal<boolean>(false);
  modalDeleted = signal<boolean>(false);
  errorMsg = signal<string>('');
  rows = signal<number | null>(null);

  selectedActivity = signal<PublicActivityResponseDto | null>(null);

  appointment = signal<FullAppointmentResponseDto | null>(null);

  schedule = signal<Schedule | null>(null);
  vacations = signal<Vacation[] | null>(null);

  sevenDaysOfWork = signal<string[] | null>(null);
  appointmentsForWorker = signal<PublicAppointment[] | null>(null);

  selectedDate = signal<string | null>(null);
  timesForActivity = signal<string[] | null>(null);

  findForm = this.fb.nonNullable.group({
    code: ['', Validators.required],
  });

  get codeControl() {
    return this.findForm.get('code');
  }

  updateForm = this.fb.nonNullable.group({
    nameUser: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1User: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname2User: ['', [Validators.maxLength(30)]],
    emailUser: ['', [Validators.required, Validators.email, CustomValidators.validateEmail]],
    phoneUser: ['', [Validators.required, CustomValidators.validatePhone]],
    dniUser: ['', [Validators.required, CustomValidators.validateDniNie]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    notes: [''],
  });

  onSubmitFind() {
    const code = this.findForm.get('code')!.value;

    this.appointmentService.findByCode(code).subscribe({
      next: (resp) => {
        const appt = resp.data!;
        this.appointment.set(appt);

        this.updateForm.patchValue({
          nameUser: appt.nameUser,
          surname1User: appt.surname1User,
          surname2User: appt.surname2User,
          dniUser: appt.dniUser,
          emailUser: appt.emailUer,
          phoneUser: appt.phoneUser,
          date: appt.date,
          time: appt.time,
          notes: appt.notes,
        });

        this.activityService.getById(this.appointment()?.serviceId!).subscribe({
          next: (resp) => {
            console.log('dasdasdsadasdsadasd', resp);
            this.selectedActivity.set(resp.data!);
          },
          error: (err) => {
            console.log(err);
          },
        });

        const workerId = appt.workerId;

        this.scheduleService.getActiveByCompanyId(appt.workerCompanyId).subscribe({
          next: (res: any) => {
            this.schedule.set(res.data);

            this.vacationService.getAllApprovedByWorker(workerId).subscribe({
              next: (vac: any) => {
                this.vacations.set(vac.data ?? []);

                const schedule = this.schedule();
                const vacations = this.vacations();
                console.log(schedule?.workdays);

                const days = Utils.CalculateWeekOfWork(schedule!, vacations!, null as any);

                this.sevenDaysOfWork.set(days.map((day) => day.toLocaleDateString('en-CA')));
              },
            });

            this.updateForm.get('date')?.valueChanges.subscribe((value) => {
              this.selectedDate.set(value);

              const workerId = this.appointment()!.workerId;

              this.appointmentService.publicGetAllByWorker(workerId).subscribe({
                next: (res: any) => {
                  this.appointmentsForWorker.set(res.data);

                  this.timesForActivity.set(
                    this.calculateTimes(this.selectedActivity()!, res.data),
                  );
                },
              });
            });
          },

          error: (err) => {
            console.log(err.error.message);
          },
        });
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  get emailControl() {
    return this.updateForm.get('emailUser');
  }

  get nameControl() {
    return this.updateForm.get('nameUser');
  }

  get surname1Control() {
    return this.updateForm.get('surname1User');
  }

  get surname2Control() {
    return this.updateForm.get('surname2User');
  }

  get dniControl() {
    return this.updateForm.get('dniUser');
  }

  get phoneControl() {
    return this.updateForm.get('phoneUser');
  }

  get dateControl() {
    return this.updateForm.get('date');
  }

  get timeControl() {
    return this.updateForm.get('time');
  }

  ngOnInit() {}

  calculateTimes(activity: PublicActivityResponseDto, appointments: PublicAppointment[]): string[] {
    console.log(activity);
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

  onUpdate() {
    if (this.updateForm.invalid) {
      this.markAllAsTouched(this.updateForm);
      return;
    }

    const dto: UpdateAppointmentRequestDto = {
      ...this.updateForm.getRawValue(),
    };

    console.log(this.updateForm.value);
    this.appointmentService.updateByCode(dto, this.appointment()!.code).subscribe({
      next: (resp) => {
        this.modalUpdated.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  delete() {
    this.appointmentService.deleteByCode(this.appointment()?.code!).subscribe({
      next: (resp) => {
        this.modalConfirm.set(false);
        this.modalDeleted.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalConfirm.set(false);
        this.modalError.set(true);
      },
    });
  }

  download() {
    this.pdfService.generatePdf(
      this.appointment()?.serviceName!,
      this.appointment()?.nameUser!,
      this.appointment()?.surname1User!,
      this.appointment()?.counter!,
      this.appointment()?.room!,
      this.appointment()?.nameWorker!,
      this.appointment()?.date!,
      this.appointment()?.time!,
    );
  }
}
