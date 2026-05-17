import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAppointment } from './find-appointment';

describe('FindAppointment', () => {
  let component: FindAppointment;
  let fixture: ComponentFixture<FindAppointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindAppointment],
    }).compileComponents();

    fixture = TestBed.createComponent(FindAppointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
