import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent, pathMatch: 'full' },
      { path: 'restaurants', component: RestaurantsComponent, pathMatch: 'full' },
      {
        path: 'my-restaurants',
        loadChildren: () => import('./my-restaurants/my-restaurant-routing.module').then(m => m.MyRestaurantRoutingModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      },
      {
        path: 'staff',
        loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
      },
      {
        path: 'dishes',
        loadChildren: () => import('./dishes/dishes.module').then(m => m.DishesModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'expense',
        loadChildren: () => import('./expense/expense.module').then(m => m.ExpenseModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      // { path: '**', redirectTo: '/404' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
