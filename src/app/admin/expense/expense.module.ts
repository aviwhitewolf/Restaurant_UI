import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseRoutingModule } from './expense-routing.module';
import { EditComponent } from './edit/edit.component';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { OverviewComponent } from './overview/overview.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { CategoryModule } from './category/category.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    OverviewComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    ReusableModule,
    MatIconModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MarkdownModule,
    MatExpansionModule,
    CategoryModule,
    MatCheckboxModule
  ]
})
export class ExpenseModule { }
