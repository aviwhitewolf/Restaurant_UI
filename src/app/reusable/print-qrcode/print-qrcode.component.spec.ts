import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQrcodeComponent } from './print-qrcode.component';

describe('PrintQrcodeComponent', () => {
  let component: PrintQrcodeComponent;
  let fixture: ComponentFixture<PrintQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintQrcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
