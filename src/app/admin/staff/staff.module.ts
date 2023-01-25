import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { StaffRoutingModule } from './staff-routing.module';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [
    EditComponent,
    OverviewComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
    ReusableModule,
    StaffRoutingModule
  ]
})
export class StaffModule { }
