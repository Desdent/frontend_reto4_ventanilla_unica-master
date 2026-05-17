import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryList } from './directory-list';

describe('DirectoryList', () => {
  let component: DirectoryList;
  let fixture: ComponentFixture<DirectoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectoryList],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectoryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
