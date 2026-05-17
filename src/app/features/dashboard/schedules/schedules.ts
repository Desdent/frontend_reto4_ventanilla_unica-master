import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment/appointment.service';
import { PublicActivityResponseDto } from '../../../core/dto/activity/public-activity-response.dto';
import { AppointmentResponseDto } from '../../../core/dto/appointment/appointment-response.dto';
import { Roles } from '../../../core/enums/role.enum';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { ScheduleResponseDto } from '../../../core/models/schedule/schedule-response.dto';
import { ScheduleService } from '../../../core/services/schedule/schedule.service';
import { TitleCasePipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { ScheduleType } from '../../../core/enums/schedule-type.enum';
import { Workday } from '../../../core/enums/workdays.enum';
import { isActive } from '@angular/router';

@Component({
  selector: 'app-schedules',
  imports: [TitleCasePipe, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './schedules.html',
  styleUrl: './schedules.css',
})
export class Schedules {
  constructor(private scheduleService: ScheduleService) {}

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  schedules = signal<ScheduleResponseDto[] | null>(null);
  loading = signal(true);
  role = signal<string | null>(null);
  roleAdmin: string = Roles.ADMIN;
  scheduleTypes = Object.values(ScheduleType);
  scheduleWorkdays = Object.values(Workday);
  scheduleSelected = signal<ScheduleResponseDto | null>(null);

  modalAddSchedule = signal<boolean>(false);
  modalAddScheduleOk = signal<boolean>(false);
  modalAddScheduleError = signal<boolean>(false);
  modalUpdateSchedule = signal<boolean>(false);
  modalUpdateScheduleOk = signal<boolean>(false);
  modalUpdateScheduleError = signal<boolean>(false);
  modalDeleteConfirm = signal<boolean>(false);
  modalDeleteOk = signal<boolean>(false);
  modalDeleteError = signal<boolean>(false);
  modalActivatedConfirm = signal<boolean>(false);
  modalActivatedOk = signal<boolean>(false);
  modalActivatedError = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));

    this.loadASchedules();
  }

  addScheduleForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      entryTime: ['', [Validators.required]],
      exitTime: ['', [Validators.required]],
      startDate: [''],
      endDate: ['', [CustomValidators.beforeTodayValidator]],

      workdays: this.fb.array<string>([], [Validators.required, Validators.minLength(1)]),
      festivities: this.fb.array<string>([]),

      type: ['', [Validators.required]],
      isActive: [false],
      companyId: [''],
    },
    {
      validators: [CustomValidators.dateRangeValidator],
    },
  );

  updateScheduleForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      entryTime: ['', [Validators.required]],
      exitTime: ['', [Validators.required]],
      startDate: ['', [CustomValidators.beforeTodayValidator]],
      endDate: ['', [CustomValidators.beforeTodayValidator]],

      workdays: this.fb.array<string>([], [Validators.required, Validators.minLength(1)]),
      festivities: this.fb.array<string>([]),

      type: ['', [Validators.required]],
      isActive: [false],
      companyId: [''],
    },
    {
      validators: [CustomValidators.dateRangeValidator],
    },
  );

  get nameControl() {
    return this.addScheduleForm.get('name');
  }

  get entryTimeControl() {
    return this.addScheduleForm.get('entryTime');
  }

  get exitTImeControl() {
    return this.addScheduleForm.get('exitTime');
  }

  get startDateControl() {
    return this.addScheduleForm.get('startDate');
  }

  get endDateControl() {
    return this.addScheduleForm.get('endDate');
  }

  get workdaysControl(): FormArray {
    return this.addScheduleForm.get('workdays') as FormArray;
  }

  get festivitiesControl(): FormArray {
    return this.addScheduleForm.get('festivities') as FormArray;
  }

  get typeControl() {
    return this.addScheduleForm.get('type');
  }

  get updateNameControl() {
    return this.updateScheduleForm.get('name');
  }

  get updateEntryTimeControl() {
    return this.updateScheduleForm.get('entryTime');
  }

  get updateExitTImeControl() {
    return this.updateScheduleForm.get('exitTime');
  }

  get updateStartDateControl() {
    return this.updateScheduleForm.get('startDate');
  }

  get updateEndDateControl() {
    return this.updateScheduleForm.get('endDate');
  }

  get updateWorkdaysControl(): FormArray {
    return this.updateScheduleForm.get('workdays') as FormArray;
  }

  get updateFestivitiesControl(): FormArray {
    return this.updateScheduleForm.get('festivities') as FormArray;
  }

  get updateTypeControl() {
    return this.updateScheduleForm.get('type');
  }

  loadASchedules() {
    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      console.log(this.payload());
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);
      this.loading.set(true);
      if (this.role() == Roles.ADMIN) {
        this.scheduleService.getAllByCompany(this.payload()?.companyId!).subscribe({
          next: (resp) => {
            this.schedules.set(resp.data!);
            this.loading.set(false);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }

  selectSchedule(schedule: ScheduleResponseDto) {
    console.log(schedule);
    this.updateScheduleForm.patchValue({
      name: schedule.name,
      entryTime: schedule.entryTime,
      exitTime: schedule.exitTime,
      startDate: schedule.startDate,
      endDate: schedule.endDate,

      type: schedule.type,
      companyId: this.payload()?.companyId,
    });

    this.updateWorkdaysControl.clear();
    schedule.workdays.forEach((day) => {
      this.updateWorkdaysControl.push(this.fb.control(day));
    });

    this.updateFestivitiesControl.clear();
    (schedule.festivities || []).forEach((f) => {
      this.updateFestivitiesControl.push(this.fb.control(f));
    });

    this.scheduleSelected.set(schedule);
    this.modalUpdateSchedule.set(true);
  }

  /**
   * This looks more than it really is
   *
   * First it checks if there is any target of the related input checked. If yes, then it includes it on the array
   *
   * If not, which means, has entered with an uncheck, then it tries to find the index of the given day, storing it on "i" and checking if the index is valid, removes it from the array
   *
   * @param {string} day
   * @param {*} event
   */
  toggleWorkday(day: string, event: any) {
    if (event.target.checked) {
      this.workdaysControl.push(this.fb.control(day));
    } else {
      const index = this.workdaysControl.controls.findIndex(
        (dayIterated) => dayIterated.value == day,
      );
      if (index !== -1) this.workdaysControl.removeAt(index);
    }
  }

  toggleWorkdayUpdate(day: string, event: any) {
    if (event.target.checked) {
      this.updateWorkdaysControl.push(this.fb.control(day));
    } else {
      const index = this.workdaysControl.controls.findIndex(
        (dayIterated) => dayIterated.value == day,
      );
      if (index !== -1) this.workdaysControl.removeAt(index);
    }
  }

  addFestivity(date: string) {
    if (!date) return;
    this.festivitiesControl.push(this.fb.control(date));
    this;
  }
  removeFestivity(index: number) {
    this.festivitiesControl.removeAt(index);
  }

  addToUpdateFestivity(date: string) {
    if (!date) return;
    this.updateFestivitiesControl.push(this.fb.control(date));
    this;
  }
  removeFromUpdateFestivity(index: number) {
    this.updateFestivitiesControl.removeAt(index);
  }

  onSubmit() {
    this.addScheduleForm.patchValue({
      companyId: this.payload()?.companyId,
    });

    console.log('sadas', this.addScheduleForm.value);

    if (this.addScheduleForm.invalid) {
      this.markAllAsTouched(this.addScheduleForm);
      return;
    }

    const raw = this.addScheduleForm.getRawValue() as ScheduleResponseDto;
    console.log(raw);

    this.scheduleService.create(raw).subscribe({
      next: (resp) => {
        this.modalAddScheduleOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.message);
        console.log(err);
        this.modalAddScheduleError.set(true);
      },
    });
  }

  onUpdate() {
    if (this.updateScheduleForm.invalid) {
      this.markAllAsTouched(this.updateScheduleForm);
      return;
    }
    this.updateScheduleForm.patchValue({
      companyId: this.payload()?.companyId,
    });
    console.log('sadas', this.payload());
    const raw = this.updateScheduleForm.getRawValue() as ScheduleResponseDto;
    console.log(raw);

    this.scheduleService.update(this.scheduleSelected()!.id, raw).subscribe({
      next: (resp) => {
        this.modalUpdateScheduleOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.message);
        this.modalUpdateScheduleError.set(true);
      },
    });
  }

  selectToDelete(schedule: ScheduleResponseDto) {
    this.scheduleSelected.set(schedule);
    this.modalDeleteConfirm.set(true);
  }

  delete() {
    this.scheduleService.delete(this.scheduleSelected()!.id).subscribe({
      next: (resp) => {
        this.modalDeleteConfirm.set(false);
        (this.modalDeleteOk.set(true),
          setTimeout(() => {
            window.location.reload();
          }, 2000));
      },
      error: (err) => {
        this.modalDeleteConfirm.set(false);
        this.errorMsg.set(err.message);
        this.modalUpdateScheduleError.set(true);
      },
    });
  }

  selectToActivate(schedule: ScheduleResponseDto) {
    this.scheduleSelected.set(schedule);
    this.modalActivatedConfirm.set(true);
  }

  activate() {
    this.scheduleService.activate(this.scheduleSelected()!.id).subscribe({
      next: (resp) => {
        this.modalActivatedConfirm.set(false);
        this.modalActivatedOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.modalActivatedConfirm.set(false);
        this.errorMsg.set(err.message);
        this.modalDeleteError.set(true);
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
