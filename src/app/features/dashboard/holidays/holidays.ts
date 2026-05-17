import { Component, inject, signal } from '@angular/core';
import { AdminViewWorkerResponseDto } from '../../../core/dto/user/admin-view-worker-response.dto';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { UserService } from '../../../core/services/users/users.service';
import { jwtDecode } from 'jwt-decode';
import { VacationResponseDto } from '../../../core/dto/vacation/vacation-response.dto';
import { VacationService } from '../../../core/services/vacation/vacation.service';
import { VacationStatus } from '../../../core/enums/vacation-status.enum';
import { Roles } from '../../../core/enums/role.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { VacationType } from '../../../core/enums/vacation-type.enum';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { CreateVacationRequestDto } from '../../../core/dto/vacation/create-vacation-request.dto';

@Component({
  selector: 'app-holidays',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, TitleCasePipe, UpperCasePipe],
  templateUrl: './holidays.html',
  styleUrl: './holidays.css',
})
export class Holidays {
  constructor(private vacationService: VacationService) {
    this.vacationTypes = Object.values(VacationType);
  }

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  modalVacation = signal<boolean>(false);
  modalOk = signal<boolean>(false);
  modalError = signal<boolean>(false);
  modalUpdateVacation = signal<boolean>(false);
  modalUpdateOk = signal<boolean>(false);
  modalUpdateError = signal<boolean>(false);
  modalConfirmDelete = signal<boolean>(false);
  modalOkDelete = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  vacationTypes: string[];
  selectedVacation = signal<VacationResponseDto | null>(null);
  loading = signal(true);
  role = signal<string | null>(null);
  vacations = signal<VacationResponseDto[] | null>(null);
  pendingStatus = signal<VacationStatus | null>(null);
  roleAdmin = signal<Roles | null>(null);
  roleWorker = signal<Roles | null>(null);
  userId = signal<string | null>(null);

  page = signal<number>(1);
  limit = signal<number>(5);
  orderBy = signal<string>('asc');
  orderField = signal<string>('status');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  ngOnInit() {
    this.roleAdmin.set(Roles.ADMIN);
    this.roleWorker.set(Roles.WORKER);

    this.pendingStatus.set(VacationStatus.PENDING);

    this.token.set(localStorage.getItem('token'));
    if (this.token()) {
      const payload: Payload = jwtDecode(this.token()!);
      this.userId.set(payload.userId);
    }

    this.loadVacations();

    const form = this.createRequestForm;

    form.valueChanges.subscribe(() => {
      form.updateValueAndValidity({ emitEvent: false });
    });
  }

  createRequestForm = this.fb.nonNullable.group(
    {
      type: ['', Validators.required],
      startDate: ['', [Validators.required, CustomValidators.beforeTodayValidator]],
      endDate: ['', [Validators.required, CustomValidators.beforeTodayValidator]],
      userId: ['', Validators.required],
    },

    {
      validators: [CustomValidators.validateVacationStart, CustomValidators.dateRangeValidator],
    },
  );

  updateRequestForm = this.fb.nonNullable.group(
    {
      type: [this.selectedVacation()?.type ?? '', Validators.required],
      startDate: [
        this.selectedVacation()?.startDate ?? '',
        [Validators.required, CustomValidators.beforeTodayValidator],
      ],
      endDate: [
        this.selectedVacation()?.endDate ?? '',
        [Validators.required, CustomValidators.beforeTodayValidator],
      ],
      userId: [this.selectedVacation()?.userId ?? '', Validators.required],
    },

    {
      validators: [CustomValidators.validateVacationStart, CustomValidators.dateRangeValidator],
    },
  );

  approveOrDenyForm = this.fb.nonNullable.group(
    {
      type: [this.selectedVacation()?.type ?? '', Validators.required],
      startDate: [
        this.selectedVacation()?.startDate ?? '',
        [Validators.required, CustomValidators.beforeTodayValidator],
      ],
      endDate: [
        this.selectedVacation()?.endDate ?? '',
        [Validators.required, CustomValidators.beforeTodayValidator],
      ],
      status: ['', Validators.required],
      userId: [this.selectedVacation()?.userId ?? '', Validators.required],
    },

    {
      validators: [CustomValidators.validateVacationStart, CustomValidators.dateRangeValidator],
    },
  );

  get typeControl() {
    return this.createRequestForm.get('type');
  }

  get startDateControl() {
    return this.createRequestForm.get('startDate');
  }

  get endDateControl() {
    return this.createRequestForm.get('endDate');
  }

  get updateTypeControl() {
    return this.updateRequestForm.get('type');
  }

  get updateStartDateControl() {
    return this.updateRequestForm.get('startDate');
  }

  get updateEndDateControl() {
    return this.updateRequestForm.get('endDate');
  }

  onSubmit() {
    this.createRequestForm.patchValue({
      userId: this.userId()!,
    });

    if (this.createRequestForm.invalid) {
      this.markAllAsTouched(this.createRequestForm);
      return;
    }

    const raw = this.createRequestForm.getRawValue() as CreateVacationRequestDto;
    console.log(raw);

    this.vacationService.create(raw).subscribe({
      next: (resp) => {
        this.modalOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  onSubmitUpdate() {
    this.updateRequestForm.patchValue({
      userId: this.userId()!,
    });

    if (this.updateRequestForm.invalid) {
      this.markAllAsTouched(this.createRequestForm);
      return;
    }

    const raw = this.updateRequestForm.getRawValue() as CreateVacationRequestDto;
    console.log(raw);

    this.vacationService.update(this.selectedVacation()?.id!, raw).subscribe({
      next: (resp) => {
        this.modalUpdateOk.set(true);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
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
      this.loadVacations();
    }
  }

  loadSearch() {
    this.loading.set(true);
    this.vacationService
      .searchTermInVactions(
        this.searchTerm(),
        this.page(),
        this.limit(),
        this.orderBy(),
        this.orderField(),
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.vacations.set(resp.data.vacations);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  loadVacations() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);

      this.loading.set(true);
      this.vacationService
        .getAllPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
        .subscribe({
          next: (resp) => {
            this.vacations.set(resp.data?.vacations!);
            console.log(resp.data?.vacations);
            this.totalPages.set(resp.data?.totalPages!);
            this.loading.set(false);
          },
        });
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadVacations();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadVacations();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadVacations();
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
    this.loadVacations();
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  selectRequest(vacation: VacationResponseDto) {
    this.selectedVacation.set(vacation);
    this.updateRequestForm.patchValue({
      endDate: vacation.endDate,
      startDate: vacation.startDate,
      type: vacation.type,
      userId: this.userId()!,
    });
    this.modalUpdateVacation.set(true);
  }

  confirmDelete(vacation: VacationResponseDto) {
    this.selectedVacation.set(vacation);
    this.modalConfirmDelete.set(true);
  }

  denyOrApprove(value: string) {
    console.log(value);

    switch (value) {
      case VacationStatus.APPROVED:
        this.approveOrDenyForm.patchValue({
          status: VacationStatus.APPROVED,
        });
        break;

      case VacationStatus.REJECTED:
        this.approveOrDenyForm.patchValue({
          status: VacationStatus.REJECTED,
        });
        break;
    }

    this.approveOrDenyForm.patchValue({
      userId: this.selectedVacation()?.userId,
      endDate: this.selectedVacation()?.endDate,
      startDate: this.selectedVacation()?.startDate,
      status: value,
      type: this.selectedVacation()?.type,
    });

    console.log(this.approveOrDenyForm.getRawValue());
    this.vacationService

      .update(
        this.selectedVacation()?.id!,
        this.approveOrDenyForm.getRawValue() as CreateVacationRequestDto,
      )
      .subscribe({
        next: (resp) => {
          (this.modalUpdateOk.set(true),
            setTimeout(() => {
              window.location.reload();
            }, 2000));
        },
        error: (err) => {
          (this.errorMsg.set(err.message), this.modalError.set(true));
        },
      });
  }

  setApprove(vacation: VacationResponseDto) {
    this.selectedVacation.set(vacation);
    this.denyOrApprove(VacationStatus.APPROVED);
  }

  setDeny(vacation: VacationResponseDto) {
    this.selectedVacation.set(vacation);
    this.denyOrApprove(VacationStatus.REJECTED);
  }

  delete() {
    this.vacationService.delete(this.selectedVacation()!.id).subscribe({
      next: (resp) => {
        this.modalConfirmDelete.set(false);
        this.modalOkDelete.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.modalConfirmDelete.set(false);
        console.log(err);
        this.errorMsg.set(err.message);
        this.modalError.set(true);
      },
    });
  }
}
