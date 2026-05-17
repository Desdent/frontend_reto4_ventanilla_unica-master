import { Component, inject, Inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Company } from '../../../core/models/company/company';
import { CompanyService } from '../../../core/services/company/company.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../utils/validators/custom-validators.validator';
import { Field } from '../../../core/models/field/field';
import { FieldService } from '../../../core/services/field/field.service';
import { UserService } from '../../../core/services/users/users.service';
import { CreateCompanyRequest } from '../../../core/interfaces/requests/create-company-request.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-companies',
  imports: [TableModule, DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies {
  constructor(
    private companyService: CompanyService,
    private fieldService: FieldService,
    private userService: UserService,
    private router: Router,
  ) {}

  fb = inject(FormBuilder);

  companies = signal<Company[] | null>(null);
  fields = signal<Field[] | null>(null);
  selectedCompany = signal<Company | null>(null);
  selectedToDelete = signal<Company | null>(null);

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
    this.loadCompanies();

    this.loadFields();
  }

  addCompanyForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    cif: ['', [Validators.required, CustomValidators.validateDniNie]],
    phone: ['', [Validators.required, CustomValidators.validatePhone]],
    address: ['', [Validators.required]],
    fieldId: ['', [Validators.required]],
    workerId: [null],
  });

  get nameControl() {
    return this.addCompanyForm.get('name');
  }

  get cifControl() {
    return this.addCompanyForm.get('cif');
  }

  get phoneControl() {
    return this.addCompanyForm.get('phone');
  }

  get addressControl() {
    return this.addCompanyForm.get('address');
  }

  get fieldIdControl() {
    return this.addCompanyForm.get('fieldId');
  }

  get workerIdControl() {
    return this.addCompanyForm.get('workerId');
  }

  onSubmit() {
    const raw = this.addCompanyForm.getRawValue();

    const data: CreateCompanyRequest = {
      ...raw,
      workerId: raw.workerId || undefined,
    };
    console.log(data);

    this.companyService.create(data).subscribe({
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

  selectCompany(company: Company) {
    this.selectedCompany.set(company);
  }

  loadCompanies() {
    if (this.isSearching()) {
      this.loadSearch();
      return;
    }

    this.loading.set(true);

    this.companyService
      .findAllPaginated(this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          this.companies.set(resp.data.companies);
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

  loadFields() {
    this.fieldService.getAll().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.fields.set(resp.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.loadCompanies();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadCompanies();
    }
  }

  goToPage(page: number) {
    this.page.set(page);
    this.loadCompanies();
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

    this.loadCompanies();
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
      this.loadCompanies();
    }
  }

  loadSearch() {
    this.loading.set(true);

    this.companyService
      .search(this.searchTerm(), this.page(), this.limit(), this.orderBy(), this.orderField())
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.companies.set(resp.data.companies);
          this.totalPages.set(resp.data.totalPages);
          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }

  confirmAction(company: Company) {
    this.selectedToDelete.set(company);
    this.modalConfirmVisible.set(true);
  }

  delete() {
    this.companyService.delete(this.selectedToDelete()!.id!).subscribe({
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
