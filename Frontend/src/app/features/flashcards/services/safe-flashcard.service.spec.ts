import { TestBed } from '@angular/core/testing';

import { SafeFlashcardService } from './safe-flashcard.service';

describe('SafeFlashcardService', () => {
  let service: SafeFlashcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafeFlashcardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
