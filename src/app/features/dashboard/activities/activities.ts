import { Component, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment/appointment.service';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { PublicActivityResponseDto } from '../../../core/dto/activity/public-activity-response.dto';
import { Roles } from '../../../core/enums/role.enum';
import { AppointmentResponseDto } from '../../../core/dto/appointment/appointment-response.dto';
import { jwtDecode } from 'jwt-decode';
import { ActivityResponseDto } from '../../../core/dto/activity/activity-response.dto';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Floor } from '../../../core/enums/Floor.enum';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FieldService } from '../../../core/services/field/field.service';
import { Field } from '../../../core/models/field/field';
import { Room } from '../../../core/models/room/room';
import { RoomService } from '../../../core/services/room/room.service';
import { RoomResponseDto } from '../../../core/dto/room/room-response.dto';
import { CreateActivityRequestDto } from '../../../core/dto/activity/create-activity-request.dto';
import { DurationAppointments } from '../../../core/enums/appointment-duration.enum';

@Component({
  selector: 'app-activities',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './activities.html',
  styleUrl: './activities.css',
})
export class Activities {
  constructor(
    private activityService: ActivityService,
    private fieldService: FieldService,
    private roomsService: RoomService,
  ) {}

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  durations = Object.values(DurationAppointments).filter((value) => typeof value === 'number');
  activities = signal<ActivityResponseDto[] | null>(null);
  selectedActivity = signal<ActivityResponseDto | null>(null);
  fields = signal<Field[]>([]);
  emptyRooms = signal<RoomResponseDto[]>([]);
  uniqueFloors = signal<Floor[]>([]);
  loading = signal(true);
  role = signal<string | null>(null);

  page = signal<number>(1);
  limit = signal<number>(5);
  orderBy = signal<string>('asc');
  orderField = signal<string>('name');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);
  errorMsg = signal<string>('');

  modalService = signal<boolean>(false);
  modalServiceOk = signal<boolean>(false);
  modalUpdateService = signal<boolean>(false);
  modalUpdateServiceOk = signal<boolean>(false);
  modalDeleteConfirm = signal<boolean>(false);
  modalDeleteOk = signal<boolean>(false);
  modalError = signal<boolean>(false);

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));

    this.loadActivities();
  }

  createServiceForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
      appointmentDuration: [
        '',
        [Validators.required, CustomValidators.validateAppointmentDuration],
      ],
      extraTime: ['', [Validators.required, Validators.min(1), Validators.max(60)]],
      fieldId: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
    },
    {
      validators: [CustomValidators.validateExtraTIme],
    },
  );

  get nameControl() {
    return this.createServiceForm.get('name');
  }

  get appointmentDurationControl() {
    return this.createServiceForm.get('appointmentDuration');
  }

  get extraTimeControl() {
    return this.createServiceForm.get('extraTime');
  }

  get fieldIdControl() {
    return this.createServiceForm.get('fieldId');
  }

  get companyIdControl() {
    return this.createServiceForm.get('companyId');
  }

  updateServiceForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(40)]],
      appointmentDuration: [0, [Validators.required]],
      extraTime: [0, [Validators.required, Validators.min(1), Validators.max(60)]],
      fieldId: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
    },
    {},
  );

  get updateNameControl() {
    return this.updateServiceForm.get('name');
  }

  get updateAppointmentDurationControl() {
    return this.updateServiceForm.get('appointmentDuration');
  }

  get updateExtraTimeControl() {
    return this.updateServiceForm.get('extraTime');
  }

  get updateFieldIdControl() {
    return this.updateServiceForm.get('fieldId');
  }

  get updateCompanyIdControl() {
    return this.updateServiceForm.get('companyId');
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
      this.loadActivities();
    }
  }

  loadSearch() {
    this.loading.set(true);
    this.activityService
      .searchInCompany(
        this.payload()?.companyId!,
        this.searchTerm(),
        this.page(),
        this.limit(),
        this.orderBy(),
        this.orderField(),
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.activities.set(resp.data.services);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  loadActivities() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);
      this.loading.set(true);
      this.activityService
        .getAllByCompanyPaginated(
          this.payload()?.companyId!,
          this.page(),
          this.limit(),
          this.orderBy(),
          this.orderField(),
        )
        .subscribe({
          next: (resp) => {
            this.activities.set(resp.data?.services!);
            console.log(resp.data?.services);
            this.totalPages.set(resp.data?.totalPages!);

            this.loading.set(false);
          },
        });

      this.fieldService.getAll().subscribe({
        next: (resp) => {
          this.fields.set(resp.data!);
        },
        error: (err) => {
          console.log(err.message);
        },
      });

      this.roomsService.getAllEmptyByCompanyId(this.payload()!.companyId!).subscribe({
        next: (resp) => {
          this.emptyRooms.set(resp.data!);
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }

  selectActivity(activity: ActivityResponseDto) {
    this.selectedActivity.set(activity);

    this.updateServiceForm.patchValue({
      appointmentDuration: activity.appointmentDuration,
      companyId: this.payload()?.companyId,
      extraTime: activity.extraTime,
      fieldId: activity.fieldId,
      name: activity.name,
    });

    this.modalUpdateService.set(true);
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadActivities();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadActivities();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadActivities();
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
    this.loadActivities();
  }

  getUniqueFloors(floors: Floor[]) {
    const uniques = [...new Set(floors)];

    return uniques;
  }

  onSubmit() {
    this.createServiceForm.patchValue({
      companyId: this.payload()?.companyId,
    });

    if (this.createServiceForm.invalid) {
      this.markAllAsTouched(this.createServiceForm);
      return;
    }

    console.log('dsadsa');
    this.createServiceForm.patchValue({
      companyId: this.payload()?.companyId!,
    });

    const raw = this.createServiceForm.getRawValue();

    const dto = new CreateActivityRequestDto({
      ...raw,
      extraTime: Number(raw.extraTime),
      appointmentDuration: Number(raw.appointmentDuration),
    });

    this.activityService.create(dto).subscribe({
      next: (resp) => {
        this.modalServiceOk.set(true);
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

  onUpdate() {
    this.updateServiceForm.patchValue({
      companyId: this.payload()?.companyId,
    });

    console.log('VALID?', this.updateServiceForm.valid);
    console.log('INVALID?', this.updateServiceForm.invalid);
    console.log('ERRORS', this.updateServiceForm.errors);
    console.log(this.updateServiceForm);

    if (this.updateServiceForm.invalid) {
      this.markAllAsTouched(this.updateServiceForm);
      return;
    }

    const raw = this.updateServiceForm.getRawValue();

    const dto = new CreateActivityRequestDto({
      ...raw,
      extraTime: Number(raw.extraTime),
      appointmentDuration: Number(raw.appointmentDuration),
    });

    this.activityService.update(this.selectedActivity()?.id!, dto).subscribe({
      next: (resp) => {
        this.modalUpdateServiceOk.set(true);
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

  confirmDelete(activity: ActivityResponseDto) {
    this.selectedActivity.set(activity);
    this.modalDeleteConfirm.set(true);
  }

  delete() {
    this.activityService.delete(this.selectedActivity()?.id!).subscribe({
      next: (resp) => {
        this.modalDeleteConfirm.set(false);
        this.modalDeleteOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.modalDeleteConfirm.set(false);
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }
}
