import { Component, Input, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';



@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  @Input()
  data: any

  public currency! : string
  
  constructor(private restaurantService : RestaurantService) {

    this.currency = restaurantService.getCurrency()
  }

  ngOnInit(): void {}


  getPercentage(data: any, index: number) {

    const total = data.reduce((acc: any, curr: any) => acc + parseInt(curr.count), 0);

    const percentage = Math.round((data[index].count / total) * 100)

    return { 'width' : percentage + '%', 'background' : data[index].modeofpayment == 'offline' ? 'red' : 'green'}

  }


}


