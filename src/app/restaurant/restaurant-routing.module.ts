import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: ':name',
    component: MenuComponent,
    children: [
      { path: 'cart', component: CartComponent, pathMatch: 'full'},
      { path: 'home', component: HomeComponent, pathMatch: 'full'},
      { path: 'search', component: SearchComponent, pathMatch: 'full'},
      { path: 'orders', component: OrdersComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '/404' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
