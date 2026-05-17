import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AppointmentService } from '../../core/services/appointment/appointment.service';

@Component({
  selector: 'app-confirm-arrive',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './confirm-arrive.html',
  styleUrl: './confirm-arrive.css',
})
export class ConfirmArrive {
  constructor(private appointmentService: AppointmentService) {}

  fb = inject(FormBuilder);

  modalConfirmed = signal<boolean>(false);
  modalError = signal<boolean>(false);
  errorMsg = signal<string>('');

  confirmForm = this.fb.nonNullable.group({
    code: ['', [Validators.required]],
  });

  get codeControl() {
    return this.confirmForm.get('code');
  }

  onSubmit() {
    if (this.confirmForm.invalid) {
      this.markAllAsTouched(this.confirmForm);
      return;
    }

    const code: string = this.confirmForm.get('code')?.value!;

    this.appointmentService.confirmArrival(code).subscribe({
      next: (resp) => {
        this.modalConfirmed.set(true);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      },
      error: (err) => {
        (console.log(err), this.errorMsg.set(err.error.message));
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
