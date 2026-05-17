import { TestBed } from '@angular/core/testing';

import { JspdfService } from './jspdf.service';

describe('Jspdf', () => {
  let service: JspdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JspdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
