import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyComponent } from './policy/policy.component';
import { WelcomeComponent } from './restaurant/welcome/welcome.component';
import { PageNotFoundComponent } from './reusable/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'welcome/:name/:tb', component: WelcomeComponent, pathMatch: 'full' },
  { path: 'policy', component: PolicyComponent, pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'restaurant',
    loadChildren: () => import('./restaurant/restaurant.module').then(m => m.RestaurantModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
  },
  { path: '404', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: "disabled",
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
