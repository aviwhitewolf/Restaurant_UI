import { TestBed } from '@angular/core/testing';

import { PaymentStatusGuard } from './payment-status.guard';

describe('PaymentStatusGuard', () => {
  let guard: PaymentStatusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PaymentStatusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
