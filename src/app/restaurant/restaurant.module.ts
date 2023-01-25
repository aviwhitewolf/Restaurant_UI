import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReusableModule } from '../reusable/reusable.module';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { SingleDishComponent } from './single-dish/single-dish.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MarkdownModule } from 'ngx-markdown';
import { OrdersComponent } from './orders/orders.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    HomeComponent,
    WelcomeComponent,
    MenuComponent,
    CartComponent,
    SingleDishComponent,
    OrdersComponent,
    SearchComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RestaurantRoutingModule,
    ReusableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CdkAccordionModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatRippleModule,
    MarkdownModule.forRoot()
  ]
})
export class RestaurantModule { }
