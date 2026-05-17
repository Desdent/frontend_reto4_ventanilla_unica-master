import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { UserService } from '../../../core/services/users/users.service';
import { jwtDecode } from 'jwt-decode';
import { PublicUserResponseDto } from '../../../core/dto/user/public-user-response.dto';
import { ApiResponseDto } from '../../../core/dto/api-response/api-response.dto';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PublicSelfUpdateRequestDto } from '../../../core/dto/user/self-update-request.dto';
import { UpdatePasswordRequestDto } from '../../../core/dto/user/update-password-request.dto';

@Component({
  selector: 'app-my-data',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './my-data.html',
  styleUrl: './my-data.css',
})
export class MyData {
  constructor(private userService: UserService) {}

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);
  user = signal<PublicUserResponseDto | null>(null);

  modalUpdateOk = signal<boolean>(false);
  modalPasswordUpdateOk = signal<boolean>(false);
  modalError = signal<boolean>(false);
  modalPassword = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit() {
    this.token.set(localStorage.getItem('token'));
    if (this.token()) {
      this.payload.set(jwtDecode(this.token()!));
      this.loadData();
    }
  }

  updateUserForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, CustomValidators.validateEmail]],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    surname2: ['', [Validators.maxLength(30)]],
    dni: ['', [Validators.required, CustomValidators.validateDniNie]],
    address: ['', [Validators.maxLength(100)]],
    phone: ['', [CustomValidators.validatePhone]],
    password: ['', [Validators.required]],
  });

  get updateEmailControl() {
    return this.updateUserForm.get('email');
  }

  get updateNameControl() {
    return this.updateUserForm.get('name');
  }

  get updateSurname1Control() {
    return this.updateUserForm.get('surname1');
  }

  get updateSurname2Control() {
    return this.updateUserForm.get('surname2');
  }

  get updateDniControl() {
    return this.updateUserForm.get('dni');
  }

  get updateAddressControl() {
    return this.updateUserForm.get('address');
  }

  get updatePhoneControl() {
    return this.updateUserForm.get('phone');
  }

  get updatePasswordControl() {
    return this.updateUserForm.get('password');
  }

  updatePasswordForm = this.fb.nonNullable.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(50),
          CustomValidators.validatePassword,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: CustomValidators.passwordMatchValidator,
    },
  );

  get updateThePasswordControl() {
    return this.updatePasswordForm.get('password');
  }

  get updateTheConfirmPasswordControl() {
    return this.updatePasswordForm.get('confirmPassword');
  }

  loadData() {
    this.userService.publicGetMyData().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.updateUserForm.patchValue({
          address: resp.data?.address,
          dni: resp.data?.dni,
          email: resp.data?.email,
          name: resp.data?.name,
          phone: resp.data?.phone,
          surname1: resp.data?.surname1,
          surname2: resp.data?.surname2,
          password: '',
        });
      },
    });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  onUpdate() {
    if (this.updateUserForm.invalid) {
      this.markAllAsTouched(this.updateUserForm);
      return;
    }

    let dto: PublicSelfUpdateRequestDto = { ...this.updateUserForm.getRawValue() };

    console.log(dto);

    this.userService.updateSelf(dto).subscribe({
      next: (resp) => {
        this.modalUpdateOk.set(true);
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

  onUpdatePassword() {
    if (this.updatePasswordForm.invalid) {
      this.markAllAsTouched(this.updateUserForm);
      return;
    }

    let dto: UpdatePasswordRequestDto = {
      password: this.updatePasswordForm.get('password')?.value!,
    };
    console.log('dsadasdassa', dto);
    this.userService.updatePass(dto).subscribe({
      next: (resp) => {
        this.modalPasswordUpdateOk.set(true);
        localStorage.removeItem('token');
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
}
