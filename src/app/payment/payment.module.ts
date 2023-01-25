import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './payment-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { DataComponent } from './data/data.component';
import { UserModule } from '../user/user.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReusableModule } from '../reusable/reusable.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home.component';
import { SuccessComponent } from './success/success.component';
import { FailComponent } from './fail/fail.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    CheckoutComponent, 
    DataComponent, 
    HomeComponent, 
    SuccessComponent, 
    FailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaymentRoutingModule,
    UserModule,
    MatProgressBarModule,
    ReusableModule,
    MatDialogModule,
    MatIconModule,
    MatRippleModule,
  ],
  providers: []
})
export class PaymentModule { }

