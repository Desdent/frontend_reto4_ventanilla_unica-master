import { Component, inject, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AdminViewWorkerResponseDto } from '../../../core/dto/user/admin-view-worker-response.dto';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { UserService } from '../../../core/services/users/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CounterResponseDto } from '../../../core/dto/counter/counter-response.dto';
import { CounterResponseWithRoomDto } from '../../../core/dto/counter/counter-response-with-room.dto';
import { CounterService } from '../../../core/services/counter/counter.service';
import { CreateWorkerRequestDto } from '../../../core/dto/user/create-worker-request.dto';

@Component({
  selector: 'app-workers',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './workers.html',
  styleUrl: './workers.css',
})
export class Workers {
  constructor(
    private userService: UserService,
    private counterService: CounterService,
  ) {}

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  id = signal<string | null>(null);

  modalCreateVisible = signal<boolean>(false);
  modalUpdateVisible = signal<boolean>(false);

  loading = signal(true);
  role = signal<string | null>(null);
  workers = signal<AdminViewWorkerResponseDto[] | null>(null);
  counters = signal<CounterResponseWithRoomDto[] | null>(null);
  selectedWorker = signal<AdminViewWorkerResponseDto | null>(null);

  page = signal<number>(1);
  limit = signal<number>(5);
  orderBy = signal<string>('asc');
  orderField = signal<string>('name');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  modalCreateOk = signal<boolean>(false);
  modalUpdateOk = signal<boolean>(false);
  modalDeleteConfirm = signal<boolean>(false);
  modalDeleteOk = signal<boolean>(false);
  modalError = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));

    this.loadEmployees();
  }

  createWorkerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.validateEmail]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname2: ['', [Validators.maxLength(30)]],
    dni: ['', [Validators.required, CustomValidators.validateDniNie]],
    address: ['', [Validators.maxLength(100)]],
    phone: ['', [CustomValidators.validatePhone]],
    companyId: ['', [Validators.required]],
    counterId: ['', [Validators.required]],
  });

  get emailControl() {
    return this.createWorkerForm.get('email');
  }

  get nameControl() {
    return this.createWorkerForm.get('name');
  }

  get surname1Control() {
    return this.createWorkerForm.get('surname1');
  }

  get surname2Control() {
    return this.createWorkerForm.get('surname2');
  }

  get dniControl() {
    return this.createWorkerForm.get('dni');
  }

  get addressControl() {
    return this.createWorkerForm.get('address');
  }

  get phoneControl() {
    return this.createWorkerForm.get('phone');
  }

  get companyIdControl() {
    return this.createWorkerForm.get('companyId');
  }

  get counterIdControl() {
    return this.createWorkerForm.get('counterId');
  }

  updateWorkerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.validateEmail]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname2: ['', [Validators.maxLength(30)]],
    dni: ['', [Validators.required, CustomValidators.validateDniNie]],
    address: ['', [Validators.maxLength(100)]],
    phone: ['', [CustomValidators.validatePhone]],
    companyId: ['', [Validators.required]],
    counterId: ['', [Validators.required]],
  });

  get updateEmailControl() {
    return this.updateWorkerForm.get('email');
  }

  get updateNameControl() {
    return this.updateWorkerForm.get('name');
  }

  get updateSurname1Control() {
    return this.updateWorkerForm.get('surname1');
  }

  get updateSurname2Control() {
    return this.updateWorkerForm.get('surname2');
  }

  get updateDniControl() {
    return this.updateWorkerForm.get('dni');
  }

  get updateAddressControl() {
    return this.updateWorkerForm.get('address');
  }

  get updatePhoneControl() {
    return this.updateWorkerForm.get('phone');
  }

  get updateCompanyIdControl() {
    return this.updateWorkerForm.get('companyId');
  }

  get updateCounterIdControl() {
    return this.updateWorkerForm.get('counterId');
  }

  selectWorker(worker: AdminViewWorkerResponseDto) {
    this.selectedWorker.set(worker);
    console.log(this.selectedWorker());

    this.updateWorkerForm.patchValue({
      address: this.selectedWorker()?.address,
      companyId: this.payload()?.companyId,
      counterId: this.selectedWorker()?.counterId,
      dni: this.selectedWorker()?.dni,
      email: this.selectedWorker()?.email,
      name: this.selectedWorker()?.name,
      phone: this.selectedWorker()?.phone,
      surname1: this.selectedWorker()?.surname1,
      surname2: this.selectedWorker()?.surname2,
    });

    this.modalUpdateVisible.set(true);
    console.log(this.updateWorkerForm.value);
  }

  onUpdate() {
    const raw = this.updateWorkerForm.getRawValue();

    const data: CreateWorkerRequestDto = {
      ...raw,
      companyId: this.payload()?.companyId!,
    };

    if (this.updateWorkerForm.invalid) {
      this.markAllAsTouched(this.updateWorkerForm);
      return;
    }

    this.userService.updateWorker(this.selectedWorker()?.id!, data).subscribe({
      next: (resp) => {
        (this.modalUpdateOk.set(true),
          setTimeout(() => {
            window.location.reload();
          }, 2000));
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
      },
    });
  }

  onSubmit() {
    const raw = this.createWorkerForm.getRawValue();

    this.createWorkerForm.patchValue({
      companyId: this.payload()?.companyId!,
    });

    const data: CreateWorkerRequestDto = {
      ...raw,
      companyId: this.payload()?.companyId!,
    };

    console.log(data);

    if (this.createWorkerForm.invalid) {
      this.markAllAsTouched(this.createWorkerForm);
      return;
    }

    this.userService.createWorker(data).subscribe({
      next: (resp) => {
        (this.modalCreateOk.set(true),
          setTimeout(() => {
            window.location.reload();
          }, 2000));
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
      this.loadEmployees();
    }
  }

  loadSearch() {
    this.loading.set(true);
    this.userService
      .searchEmployees(
        this.searchTerm(),
        this.page(),
        this.limit(),
        this.orderBy(),
        this.orderField(),
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.workers.set(resp.data.workers);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  loadEmployees() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      this.id.set(this.payload()?.userId!);
      this.role.set(this.payload()?.role!);

      this.loading.set(true);
      this.userService
        .getAllWorkersPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
        .subscribe({
          next: (resp) => {
            this.workers.set(resp.data?.workers!);
            console.log(resp.data?.workers);
            this.totalPages.set(resp.data?.totalPages!);
            this.loading.set(false);
          },
        });

      this.counterService.findAllEmptyByCompany(this.payload()?.companyId!).subscribe({
        next: (resp) => {
          this.counters.set(resp.data!);
        },
        error: (err) => {
          console.log(err.message);
        },
      });
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadEmployees();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadEmployees();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadEmployees();
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
    this.loadEmployees();
  }

  confirmDelete(worker: AdminViewWorkerResponseDto) {
    this.selectedWorker.set(worker);
    this.modalDeleteConfirm.set(true);
  }

  delete() {
    this.userService.delete(this.selectedWorker()?.id!).subscribe({
      next: (resp) => {
        this.modalDeleteConfirm.set(false);
        this.modalDeleteOk.set(true);
        setInterval(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalDeleteConfirm.set(false);
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
}
