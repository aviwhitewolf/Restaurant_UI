import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from 'src/app/reusable/error-msg/error-msg.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {


  public total: number = 0

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
  public currencySymbol = ""
  constructor(
    private mainService: MainService,
    private router: Router,
    private route: ActivatedRoute,
    private restaturantService: RestaurantService,
    public dialog: MatDialog
  ) {
    this.currencySymbol = mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
  }

  ngOnInit(): void {
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    if (this.cartItems) {
      this.total = this.restaturantService.calculateTotal(this.cartItems)
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

  private openDialog(heading: string, error: string, type: string) {
    this.dialog.open(ErrorMsgComponent, {
      data: {
        message: error,
        type: type,
        heading: heading
      },
      panelClass: 'popUp-modalbox'
    });
  }


}
