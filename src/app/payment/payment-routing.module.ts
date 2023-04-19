import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentStatusGuard } from '../reusable/guard/payment/payment-status.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { FailComponent } from './fail/fail.component';
import { HomeComponent } from './home/home.component';
import { SuccessComponent } from './success/success.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'checkout', component: CheckoutComponent, pathMatch: 'full', canActivate: [PaymentStatusGuard] },
      { path: 'success', component: SuccessComponent, pathMatch: 'full', canActivate: [PaymentStatusGuard] },
      { path: 'failed', component: FailComponent, pathMatch: 'full', canActivate: [PaymentStatusGuard] },
      // { path: '**', redirectTo: '/404' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
