import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MenuRoutingModule } from './menu-routing.module';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@NgModule({
  declarations : [
    EditComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReusableModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MenuRoutingModule,
    CdkAccordionModule
  ]
})
export class MenusModule { }
