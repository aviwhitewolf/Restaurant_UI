import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishChartComponent } from './dish-chart.component';

describe('DishChartComponent', () => {
  let component: DishChartComponent;
  let fixture: ComponentFixture<DishChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
