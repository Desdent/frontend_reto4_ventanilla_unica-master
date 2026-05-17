import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Router, RouterLink } from '@angular/router';
import { CustomValidators } from '../../utils/validators/custom-validators.validator';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    DividerModule,
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);

  authService = inject(AuthService);
  router = inject(Router);
  loginError = signal<boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, CustomValidators.validateEmail]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(50),
        CustomValidators.validatePassword,
      ],
    ],
  });

  ngOnInit() {}

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markAllAsTouched(this.loginForm);
      return;
    }

    this.authService
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe((resp) => {
        if (resp) {
          this.router.navigateByUrl('/');
        }

        this.loginError.set(true);
      });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
