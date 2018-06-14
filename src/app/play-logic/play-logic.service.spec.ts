import { TestBed, inject } from '@angular/core/testing';

import { PlayLogicService } from './play-logic.service';

describe('PlayLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayLogicService]
    });
  });

  it('should be created', inject([PlayLogicService], (service: PlayLogicService) => {
    expect(service).toBeTruthy();
  }));
});
