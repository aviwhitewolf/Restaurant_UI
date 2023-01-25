import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReusableModule } from '../reusable/reusable.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { UserModule } from '../user/user.module';
import { NgApexchartsModule } from "ng-apexcharts";
import { StatisticsModule } from './statistics/statistics.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    RestaurantsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgApexchartsModule,
    ReusableModule,
    UserModule,
    StatisticsModule
  ]
})
export class AdminModule { }
