import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDishBottomSheetComponent } from './single-dish-bottom-sheet.component';

describe('SingleDishBottomSheetComponent', () => {
  let component: SingleDishBottomSheetComponent;
  let fixture: ComponentFixture<SingleDishBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleDishBottomSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDishBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
