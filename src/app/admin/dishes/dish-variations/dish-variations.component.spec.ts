import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishVariationsComponent } from './dish-variations.component';

describe('DishVariationsComponent', () => {
  let component: DishVariationsComponent;
  let fixture: ComponentFixture<DishVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishVariationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
