import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { DishRoutingModule } from './dish-routing.module';

@NgModule({
  declarations: [
    EditComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReusableModule,
    DishRoutingModule,
    ReactiveFormsModule
  ]
})
export class DishesModule { }
