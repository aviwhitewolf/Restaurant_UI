import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../admin.service';
import * as moment from 'moment';
import { UserService } from 'src/app/user/user.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public restaurant: any
  public orders: any
  public loading: boolean = true
  public user: any;
  public overview: any
  public expense: number = 0
  public profit: number = 0
  public selectedTotal: number = 0
  public dateData: any
  public activeDateRange: string = ""

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {
  }

  ngOnInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.getUserInfo()
        this.initDate(restaurantSlug)
      }
    


  }

  private async initDate(slug: string) {

    const date = await this.mainService.getSelectedDate()
    if (date?.start && date?.end && date?.type) {
      this.activeDateRange = date.type
      this.dateData = date
      this.getOverview(slug,
        moment(date.start).startOf('day').toISOString(),
        moment(date.end).endOf('day').toISOString()
      )
    }

  }

  getUserInfo() {
    this.user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
  }

  returnZero() {
    return 0
  }



  dateRangeChanged(date: any) {
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
        this.activeDateRange = date.type
        this.dateData = date
        this.getOverview(restaurantSlug,
          moment(date.start).startOf('day').toISOString(),
          moment(date.end).endOf('day').toISOString())
      }
    
  }


  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  public getWish(): string {
    const hr = new Date().getHours();
    if (hr >= 0 && hr < 12) {
      return "Good Morning";
    } else if (hr == 12) {
      return "Good Noon";
    } else if (hr >= 12 && hr <= 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  getOverview(slug: string, start: string, end: string) {
    this.loading = true
    this.adminService.getOverview(start, end, slug)
      .then((res: any) => {
        this.overview = res.data
        this.restaurant = this.overview.restaurant
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }


  getTotalExpense(): number {
    if (this.overview?.expense) {
      this.expense = this.overview?.expense.reduce((prev: any, curr: any) => prev + curr.price, 0)
      this.profit = this.selectedTotal - this.expense
    }
    return this.expense
  }



}
