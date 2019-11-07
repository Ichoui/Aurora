import { TestBed } from '@angular/core/testing';

import { AuroraService } from './aurora.service';

describe('AuroraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuroraService = TestBed.get(AuroraService);
    expect(service).toBeTruthy();
  });
});
