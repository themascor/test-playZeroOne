import { TestBed, inject } from '@angular/core/testing';

import { PlayRulesService } from './play-rules.service';

describe('PlayRulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayRulesService]
    });
  });

  it('should be created', inject([PlayRulesService], (service: PlayRulesService) => {
    expect(service).toBeTruthy();
  }));
});
