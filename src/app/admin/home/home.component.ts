import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { AdminService } from '../admin.service';
import * as moment from 'moment';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public restaurant: any
  public orders: any
  public currencySymbol = ""
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
    private userService: UserService
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
  }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.getUserInfo()
        this.initDate(param['slug'])
      }
    });


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
    this.loading = true
    this.userService.checkLoggedIn(this.mainService.getToLocalStorage(Constants.LOCAL_USER).jwt)
      .then((res) => {
        this.user = res.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      })
  }

  returnZero() {
    return 0
  }



  dateRangeChanged(date: any) {
    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['slug']) {
        this.activeDateRange = date.type
        this.dateData = date
        this.getOverview(param['slug'],
          moment(date.start).startOf('day').toISOString(),
          moment(date.end).endOf('day').toISOString())
      }
    })
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
