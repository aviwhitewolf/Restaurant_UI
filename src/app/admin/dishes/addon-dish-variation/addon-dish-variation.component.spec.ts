import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddonDishVariationComponent } from './addon-dish-variation.component';

describe('AddonDishVariationComponent', () => {
  let component: AddonDishVariationComponent;
  let fixture: ComponentFixture<AddonDishVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddonDishVariationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddonDishVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
