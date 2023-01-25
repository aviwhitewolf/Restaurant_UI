import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { EditComponent } from './edit/edit.component';
import { CategoryRoutingModule } from './category-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    OverviewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MatIconModule,
    ReusableModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
