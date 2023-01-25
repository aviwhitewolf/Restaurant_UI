import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { RestaurantService } from '../restaurant.service';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  public orders: any = null
  public currencySymbol = ""
  public isLoggedIn = false
  public loading: boolean = false
  public restaurantName = ""
  expandedIndex = 0;

  constructor(
    private restaurantService: RestaurantService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    this.isLoggedIn = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt && this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt.length > 0 ? true : false
  }

  ngOnInit(): void {
    if (this.isLoggedIn){
      this.route?.parent?.params.subscribe((param: any) => {
        if (param && param['name']) {
          this.getOrders(param['name'] || "")
        }
      });
    }
      
  }

  public checkForToday(sDate: string): boolean {
    const date = new Date(sDate)
    const createdDate = "" + date.getDay() + date.getMonth() + date.getFullYear()
    const today = "" + new Date().getDay() + new Date().getMonth() + new Date().getFullYear()
    if (createdDate == today)
      return true
    else
      return false
  }

  async getOrders(slug: string) {
    this.loading = true
    this.restaurantService.getOrders(slug)
      .then((res: any) => {
        this.orders = res.results
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  changeUrlToOpenUserInfo() {
    this.router.navigate([], { queryParams: { userInfo: true } });
  }


}

