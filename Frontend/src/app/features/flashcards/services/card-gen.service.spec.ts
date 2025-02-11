import { TestBed } from '@angular/core/testing';

import { CardGenService } from './card-gen.service';

describe('CardGenService', () => {
  let service: CardGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardGenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
