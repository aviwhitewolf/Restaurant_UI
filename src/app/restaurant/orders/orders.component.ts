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
  public isLoggedIn = false
  public loading: boolean = false
  public expandedIndex = 0;

  public showDeleteDialog: boolean = false
  public orderIdToDelete: any

  constructor(
    private restaurantService: RestaurantService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoggedIn = this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt && this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt?.length > 0 ? true : false
  }

  ngOnInit(): void {
    if (this.isLoggedIn){
      const restaurantSlug = this.restaurantService.getRestaurantSlug()
      if (restaurantSlug)
          this.getOrders(restaurantSlug)
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

  deleteOrder(orderId: string) {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.restaurantService.deletePendingOrder( orderId, restaurantSlug)
          .then((res) => {
            this.loading = false
            this.mainService.openDialog("Success", "Order deleted successfully", "S", true, false)
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
          })
      }
  }


}

