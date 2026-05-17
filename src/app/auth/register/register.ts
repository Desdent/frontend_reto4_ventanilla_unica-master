import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../utils/validators/custom-validators.validator';
import { PublicUser } from '../../core/models/user/public-user';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fb = inject(FormBuilder);

  service = inject(AuthService);
  router = inject(Router);

  // Without the nonnullable when mapping the data it gives error cuz angular thinks the form can be given as null
  registerForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, CustomValidators.validateEmail]],
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
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      surname1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      surname2: ['', [Validators.maxLength(30)]],
      address: ['', [Validators.maxLength(30)]],
      dni: ['', [Validators.required, CustomValidators.validateDniNie]],
      phone: ['', [Validators.required, CustomValidators.validatePhone]],
    },
    {
      validators: CustomValidators.passwordMatchValidator,
    },
  );

  visible = signal(false);
  visibleCorrect = signal(false);

  ngOnInit() {}

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  get nameControl() {
    return this.registerForm.get('name');
  }

  get surname1Control() {
    return this.registerForm.get('surname1');
  }

  get surname2Control() {
    return this.registerForm.get('surname2');
  }

  get phoneControl() {
    return this.registerForm.get('phone');
  }

  get dniControl() {
    return this.registerForm.get('dni');
  }

  get addressControl() {
    return this.registerForm.get('address');
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.markAllAsTouched(this.registerForm);
      return;
    }
    const raw = this.registerForm.getRawValue();

    const formData: PublicUser = {
      email: raw.email,
      password: raw.password,
      name: raw.name,
      surname1: raw.surname1,
      surname2: raw.surname2,
      address: raw.address,
      dni: raw.dni,
      phone: raw.phone,
    };

    this.service.register(formData).subscribe({
      next: (resp) => {
        if (resp) {
          console.log(resp);
          setTimeout(() => {
            this.visibleCorrect.set(true);
          });
          setTimeout(() => {
            this.service.login(formData.email, formData.password).subscribe((resp) => {
              if (resp) {
                this.router.navigateByUrl('/');
              }
            });
          }, 3000);
        } else {
          setTimeout(() => {
            this.visible.set(true);
          });
        }
      },
      error: (err) => {
        console.log(err);
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
