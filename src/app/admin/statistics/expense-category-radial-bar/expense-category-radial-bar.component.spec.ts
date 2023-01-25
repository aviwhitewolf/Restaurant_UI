import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryRadialBarComponent } from './expense-category-radial-bar.component';

describe('ExpenseCategoryRadialBarComponent', () => {
  let component: ExpenseCategoryRadialBarComponent;
  let fixture: ComponentFixture<ExpenseCategoryRadialBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseCategoryRadialBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryRadialBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
