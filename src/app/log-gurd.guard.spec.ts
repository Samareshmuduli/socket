import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logGurdGuard } from './log-gurd.guard';

describe('logGurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logGurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
