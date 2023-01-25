import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { OverviewComponent } from './overview/overview.component';
import { TableRoutingModule } from './table-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from 'src/app/reusable/reusable.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NgxPrintModule } from 'ngx-print';

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
    ReactiveFormsModule,
    TableRoutingModule,
    NgxQRCodeModule,
    NgxPrintModule,
  ]
})
export class TablesModule { }
