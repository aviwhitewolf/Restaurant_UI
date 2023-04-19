import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyComponent } from '../policy/policy.component';
import { WelcomeComponent } from '../restaurant/welcome/welcome.component';
import { PageNotFoundComponent } from '../reusable/page-not-found/page-not-found.component';
import { EntryPointComponent } from './entry-point.component';

const routes: Routes = [{
  path: '',
  component : EntryPointComponent,
  children: [
    { path: 'welcome/:tb', component: WelcomeComponent, pathMatch: 'full' },
    { path: 'policy', component: PolicyComponent, pathMatch: 'full' },
    {
      path: 'admin',
      loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
    },
    {
      path: '',
      loadChildren: () => import('../restaurant/restaurant.module').then(m => m.RestaurantModule)
    },
    {
      path: 'payment',
      loadChildren: () => import('../payment/payment.module').then(m => m.PaymentModule)
    },
    // { path: '404', component: PageNotFoundComponent, pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryPointRoutingModule { }
