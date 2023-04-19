import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { TaxComponent } from './tax/tax.component';
import { MyRestaurantRoutingModule } from './my-restaurant-routing.module';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditTaxComponent } from './edit-tax/edit-tax.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';



@NgModule({
  declarations: [
    OverviewComponent,
    TaxComponent,
    EditTaxComponent
  ],
  imports: [
    CommonModule,
    MyRestaurantRoutingModule,
    ReusableModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CdkAccordionModule
  ]
})
export class MyRestaurantsModule { }
