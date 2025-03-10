import { TestBed } from '@angular/core/testing';

import { WeightedRandomSelectionService } from './weighted-random-selection.service';

describe('WeightedRandomSelectionService', () => {
  let service: WeightedRandomSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeightedRandomSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
