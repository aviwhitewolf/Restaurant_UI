import { Component, Input, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {

  @Input()
  order: any

  public restaurantDetails: any

  constructor(private restaurantService: RestaurantService) {

    this.restaurantDetails = restaurantService.getRestaurantData()

  }

  ngOnInit(): void {
  }



}
