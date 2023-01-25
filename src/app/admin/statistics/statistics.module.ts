import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { DishChartComponent } from './dish-chart/dish-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseChartComponent } from './expense-chart/expense-chart.component';
import { CardsComponent } from './cards/cards.component';
import { ExpenseCategoryRadialBarComponent } from './expense-category-radial-bar/expense-category-radial-bar.component';



@NgModule({
  declarations: [
    SalesChartComponent,
    DishChartComponent,
    ExpenseChartComponent,
    CardsComponent,
    ExpenseCategoryRadialBarComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatIconModule
  ],
  exports : [
    SalesChartComponent,
    DishChartComponent,
    ExpenseChartComponent,
    CardsComponent,
    ExpenseCategoryRadialBarComponent
  ]
})
export class StatisticsModule { }
