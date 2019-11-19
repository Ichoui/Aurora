import { TestBed } from '@angular/core/testing';

import { HttpsInterceptorService } from './https-interceptor.service';

describe('HttpsInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpsInterceptorService = TestBed.get(HttpsInterceptorService);
    expect(service).toBeTruthy();
  });
});
