import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyData } from './company-data';

describe('CompanyData', () => {
  let component: CompanyData;
  let fixture: ComponentFixture<CompanyData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyData],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
