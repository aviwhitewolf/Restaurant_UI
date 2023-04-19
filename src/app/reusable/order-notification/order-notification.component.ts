import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrls: ['./order-notification.component.css']
})
export class OrderNotificationComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackRef: MatSnackBarRef<OrderNotificationComponent>,
    private restaurantService : RestaurantService
    ) { }

  ngOnInit(): void {
    console.log("Socket Data", this.data)
  }

  dismiss() {
    this._snackRef.dismiss();
  }

  getRestaurantSlug(): any|string {
    return this.restaurantService.getRestaurantSlug()
    }

}
