import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingScreen } from './waiting-screen';

describe('WaitingScreen', () => {
  let component: WaitingScreen;
  let fixture: ComponentFixture<WaitingScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
