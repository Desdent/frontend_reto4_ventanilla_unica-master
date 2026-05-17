import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmArrive } from './confirm-arrive';

describe('ConfirmArrive', () => {
  let component: ConfirmArrive;
  let fixture: ComponentFixture<ConfirmArrive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmArrive],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmArrive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
