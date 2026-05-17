import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/users/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminTypeUser } from '../../../core/dto/user/admin-type-user.dto';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { Company } from '../../../core/models/company/company';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CompanyService } from '../../../core/services/company/company.service';

@Component({
  selector: 'app-admins',
  imports: [DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './admins.html',
  styleUrl: './admins.css',
})
export class Admins {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private router: Router,
  ) {}

  fb = inject(FormBuilder);

  companies = signal<Company[] | null>(null);
  admins = signal<AdminTypeUser[] | null>(null);

  selectedToDelete = signal<AdminTypeUser | null>(null);

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
  limit = signal<number>(3);
  orderBy = signal<string>('asc');
  orderField = signal<string>('name');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  ngOnInit() {
    this.loadAdmins();
  }

  createAdminForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.validateEmail]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1: ['', [Validators.required]],
    surname2: [''],
    dni: ['', [Validators.required, CustomValidators.validateDniNie]],
    phone: ['', [CustomValidators.validatePhone]],
    companyId: ['', [Validators.required]],
  });

  get emailControl() {
    return this.createAdminForm.get('email');
  }

  get nameControl() {
    return this.createAdminForm.get('name');
  }

  get surname1Control() {
    return this.createAdminForm.get('surname1');
  }

  get surname2Control() {
    return this.createAdminForm.get('surname2');
  }

  get dniControl() {
    return this.createAdminForm.get('dni');
  }

  get phoneControl() {
    return this.createAdminForm.get('phone');
  }

  get companyIdControl() {
    return this.createAdminForm.get('companyId');
  }

  onSubmit() {
    if (this.createAdminForm.invalid) {
      this.markAllAsTouched(this.createAdminForm);
      return;
    }

    const raw = this.createAdminForm.getRawValue();
    console.log(raw);
    this.userService.createAdmin(raw).subscribe({
      next: (resp) => {
        this.modalOkVisible.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set(err.error.message);
        this.modalErrorVisible.set(true);
      },
    });
  }

  selectAdmin(admin: AdminTypeUser) {
    this.selectedToDelete.set(admin);
  }

  loadAdmins() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    this.loading.set(true);
    console.log(this.orderField());

    this.userService
      .getAllAdminsPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          this.admins.set(resp.data.admins);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
          console.log(resp);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });

    this.companyService.findAll().subscribe({
      next: (resp: any) => {
        this.companies.set(resp.data);
      },
    });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadAdmins();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadAdmins();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadAdmins();
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

    this.loadAdmins();
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
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
      this.loadAdmins();
    }
  }

  loadSearch() {
    console.log(this.orderField());
    this.loading.set(true);
    this.userService
      .searchAdmins(this.searchTerm(), this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.admins.set(resp.data.admins);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  confirmAction(admin: AdminTypeUser) {
    this.selectedToDelete.set(admin);
    this.modalConfirmVisible.set(true);
  }

  delete() {
    this.userService.delete(this.selectedToDelete()!.id!).subscribe({
      next: (resp) => {
        this.modal3OkVisible.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.data.error);
        console.log(err.data.error);
        this.modal3ErrorVisible.set(true);
      },
    });
  }
}
