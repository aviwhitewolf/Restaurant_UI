import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {


  public subtotal: number = 0
  public calculatedTaxes : any = []
  public total : number = 0

  // private orderDemoInfo = {
  //   "details": {},
  //   "currency": "INR",
  //   "orderId": "#MONAL20220224_1925",
  //   "orderItems": [
  //     {
  //       "orderDishCategory": [
  //         {
  //           "quantity": 2,
  //           "name": "small",
  //         },
  //         {
  //           "quantity": 2,
  //           "name": "large",
  //         }
  //       ],
  //       "dish": 1
  //     },
  //     {
  //       "orderDishCategory":
  //         [
  //           {
  //             "quantity": 50,
  //             "name": "small",
  //           },
  //           {
  //             "quantity": 200,
  //             "name": "large",
  //           }
  //         ],
  //       "dish": 5
  //     }
  //   ],
  //   "user": 1,
  //   "restaurant": 1
  // }

  public cartItems: any
  public currency! : string
  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private restaturantService: RestaurantService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    this.currency = this.restaturantService.getCurrency()
    if (this.cartItems) {
      this.subtotal = this.restaturantService.calculateTotal(this.cartItems)
      
      const totalWithTax = this.mainService.calculateTaxes(this.subtotal, this.restaturantService.getTaxes())
      this.calculatedTaxes = totalWithTax?.taxes
      this.total = totalWithTax?.total

      
    } else {
      this.route?.parent?.params.subscribe((param: any) => {
        if (param && param['name']) {
          this.router.navigate(['/restaurant', param['name'], 'cart'])
        } else {
          this.mainService.openDialog("Error", "Invalid Url", "E")
        }
      });
    }
  }



}
