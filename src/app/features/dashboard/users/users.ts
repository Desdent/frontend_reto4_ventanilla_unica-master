import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/users/users.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { UserResponseDto } from '../../../core/dto/user/user-response.dto';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  constructor(private userService: UserService) {}

  fb = inject(FormBuilder);

  users = signal<UserResponseDto[] | null>(null);
  selectedUser = signal<UserResponseDto | null>(null);

  loading = signal<boolean>(true);
  modalAddUser = signal<boolean>(false);
  modalAddUserOk = signal<boolean>(false);
  modalConfirmAction = signal<boolean>(false);
  modalActionOk = signal<boolean>(false);
  modalError = signal<boolean>(false);
  errorMsg = signal<string | null>(null);
  ban = signal<boolean>(false);
  actionMsg = signal<string>('');

  page = signal<number>(1);
  limit = signal<number>(3);
  orderBy = signal<string>('asc');
  orderField = signal<string>('name');
  totalPages = signal<number>(0);
  searchTerm = signal<string>('');
  isSearching = signal<boolean>(false);

  ngOnInit() {
    this.loadUsers();
  }

  createUserForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.validateEmail]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1: ['', [Validators.required]],
    surname2: [''],
    dni: ['', [Validators.required, CustomValidators.validateDniNie]],
    phone: ['', [CustomValidators.validatePhone]],
    address: ['', [Validators.maxLength(100)]],
  });

  get emailControl() {
    return this.createUserForm.get('email');
  }

  get nameControl() {
    return this.createUserForm.get('name');
  }

  get surname1Control() {
    return this.createUserForm.get('surname1');
  }

  get surname2Control() {
    return this.createUserForm.get('surname2');
  }

  get dniControl() {
    return this.createUserForm.get('dni');
  }

  get phoneControl() {
    return this.createUserForm.get('phone');
  }

  get addressControl() {
    return this.createUserForm.get('adrres');
  }

  onSubmit() {
    if (this.createUserForm.invalid) {
      this.markAllAsTouched(this.createUserForm);
      return;
    }

    const raw = this.createUserForm.getRawValue();

    const dto = {
      ...raw,
    };

    this.userService.createUser(dto).subscribe({
      next: (resp) => {
        this.modalAddUserOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.message);
        this.modalError.set(true);
        console.log(err);
      },
    });
  }

  loadUsers() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    this.loading.set(true);
    console.log(this.orderField());

    this.userService
      .getAllUsersPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          this.users.set(resp.data.users);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
          console.log(resp);
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
      this.loadUsers();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadUsers();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadUsers();
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

    this.loadUsers();
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
      this.loadUsers();
    }
  }

  loadSearch() {
    console.log(this.orderField());
    this.loading.set(true);
    this.userService
      .searchUsers(this.searchTerm(), this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.users.set(resp.data?.users!);
          this.totalPages.set(resp.data?.totalPages!);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  confirmAction(user: UserResponseDto) {
    this.selectedUser.set(user);
    console.log(this.selectedUser());
    this.modalConfirmAction.set(true);

    if (user.isActive) this.ban.set(true);
    else this.ban.set(false);
  }

  banUnban() {
    this.userService.banUnban(this.selectedUser()?.id!).subscribe({
      next: (resp) => {
        if (this.ban()) this.actionMsg.set('User banned');
        else this.actionMsg.set('User unbanned');

        this.modalConfirmAction.set(false);
        this.modalActionOk.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        this.errorMsg.set(err.error.mesage);
        this.modalConfirmAction.set(false);
        this.modalError.set(true);
      },
    });
  }
}
