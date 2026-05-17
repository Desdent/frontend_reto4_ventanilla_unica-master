import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysAppoitments } from './todays-appointments';

describe('TodaysAppoitments', () => {
  let component: TodaysAppoitments;
  let fixture: ComponentFixture<TodaysAppoitments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysAppoitments],
    }).compileComponents();

    fixture = TestBed.createComponent(TodaysAppoitments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
