import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { DishRoutingModule } from './dish-routing.module';
import { DishVariationsModule } from './dish-variations/dish-variations.module';
import { AddonDishVariationComponent } from './addon-dish-variation/addon-dish-variation.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
@NgModule({
  declarations: [
    EditComponent,
    OverviewComponent,
    AddonDishVariationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReusableModule,
    DishRoutingModule,
    ReactiveFormsModule,
    DishVariationsModule,
    CdkAccordionModule
    
  ]
})
export class DishesModule { }
