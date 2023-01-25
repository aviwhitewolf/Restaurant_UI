import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { OverviewComponent } from './overview/overview.component';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OrderRoutingModule } from './order-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    CreateComponent,
    ViewComponent,
    OverviewComponent,
    RightSideBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatIconModule,
    ReactiveFormsModule,
    ReusableModule,
    OrderRoutingModule,
    MatCheckboxModule,
    ScrollingModule,
    MatProgressBarModule
  ]
})
export class OrdersModule { }
