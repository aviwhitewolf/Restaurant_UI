import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditV1Component } from './edit-v1.component';

describe('EditV1Component', () => {
  let component: EditV1Component;
  let fixture: ComponentFixture<EditV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditV1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
