import { TestBed, inject } from '@angular/core/testing';

import { LogerService } from './loger.service';

describe('LogerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogerService]
    });
  });

  it('should be created', inject([LogerService], (service: LogerService) => {
    expect(service).toBeTruthy();
  }));
});
