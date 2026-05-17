import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Payload } from '../../../core/interfaces/payload/payload-structure.interface';
import { jwtDecode } from 'jwt-decode';
import { CompanyService } from '../../../core/services/company/company.service';
import { PublicCompanyResponseDto } from '../../../core/dto/company/public-company-response.dto';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';

@Component({
  selector: 'app-company-data',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './company-data.html',
  styleUrl: './company-data.css',
})
export class CompanyData {
  constructor(private companyService: CompanyService) {}

  fb = inject(FormBuilder);

  token = signal<string | null>(null);
  payload = signal<Payload | null>(null);

  company = signal<PublicCompanyResponseDto | null>(null);

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

  companyForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    cif: ['', [Validators.required, CustomValidators.validateDocument]],
    phone: ['', [Validators.required, CustomValidators.validatePhone]],
    address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
  });

  get nameControl() {
    return this.companyForm.get('name');
  }

  get cifControl() {
    return this.companyForm.get('cif');
  }

  get phoneControl() {
    return this.companyForm.get('phone');
  }

  get addressControl() {
    return this.companyForm.get('address');
  }

  get passwordControl() {
    return this.companyForm.get('password');
  }

  loadData() {
    this.companyService.publicFindById(this.payload()?.companyId!).subscribe({
      next: (resp) => {
        this.company.set(resp.data!);

        this.companyForm.patchValue({
          address: this.company()?.address,
          cif: this.company()?.cif,
          name: this.company()?.name,
          phone: this.company()?.phone,
          password: '',
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onUpdate() {
    if (this.companyForm.invalid) {
      this.markAllAsTouched(this.companyForm);
      return;
    }

    let dto: PublicCompanyResponseDto = {
      address: this.companyForm.get('address')?.value!,
      cif: this.companyForm.get('cif')?.value!,
      name: this.companyForm.get('name')?.value!,
      phone: this.companyForm.get('phone')?.value!,
    };

    console.log(dto);

    this.companyService.update(this.payload()?.companyId!, dto).subscribe({
      next: (resp) => {
        this.modalUpdateOk.set(true);
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
}
