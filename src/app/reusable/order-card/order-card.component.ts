import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { OrderItems } from 'src/app/Constants/Interface/OrderItems';
import { MainService } from 'src/app/main.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css']
})
export class OrderCardComponent implements OnInit {

  @Input()
  orderItems!: OrderItems[];

  @Input()
  currency : string = "INR"

  @Input()
  taxes!: any[];

  constructor(private mainService : MainService) { 
  }

  ngOnInit(): void {
  }

  public getImageUrl(image : any){
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

}
