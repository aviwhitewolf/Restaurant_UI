import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  public loading: boolean = true
  public showDateRange: boolean = false
  public restaurant: any
  public order: any
  public currencySymbol = ""
  public dropDown = Constants.ADMIN_DROPDOWN_ORDER_MENU
  public dropDownSelectedValue: any = {}
  public showRightSideBar: boolean = false
  public orders: any
  private page: number = 1
  private pageSize: number = 20

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  constructor(
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] = ""
    this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] = ""
    this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] = ""

  }

  ngOnInit(): void {

    this.route?.parent?.parent?.params.subscribe((mparam: any) => {
      if (mparam && mparam['slug']) {
        this.route?.params.subscribe((param: any) => {
          this.getSingleOrder(mparam['slug'], +param['orderId'])
        })
      }
    });
  }




  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  getSingleOrder(slug: string, orderId: number) {
    this.loading = true
    this.adminService.getSingleOrder(slug, orderId)
      .then((res: any) => {
        this.order = res.data.results[0]
        if (this.order) {
          this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] = this.order.status
          this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] = this.order.foodStatus
          this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] = this.order.preparationTime
        } else {
          this.mainService.openDialog("Error", this.mainService.errorMessage("No data found", true), "E")
        }
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }


  updateOrder(orderId: number) {
    this.loading = true
    const updateOrder = {
      status: this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] || this.order.status,
      foodStatus: this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] || this.order.foodStatus,
      preparationTime: this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] || this.order.preparationTime,
      mUpdatedBy: [this.mainService.getToLocalStorage(Constants.LOCAL_USER).id]
    }

    this.adminService.updateOrder(orderId, updateOrder)
      .then((result) => {
        this.loading = false
        this.mainService.openDialog("Success", "Order Updated Successfully with Order id: " + result.data.orderId, "S", true, false)
      }).catch((err) => {
        this.loading = false
        console.log(err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  public getSelectedValue(subRow: string, name: string) {
    if (name == Constants.ADMIN_ORDER_STATUS_DROPDOWN) {
      if (this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] == subRow) return true
    }
    else if (name == Constants.ADMIN_FOOD_STATUS_DROPDOWN) {
      if (this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] == subRow) return true
    }
    else if (name == Constants.ADMIN_FOOD_PREPARATION_DROPDOWN) {
      if (this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] == subRow) return true
    }
    return false
  }

  public changeSelectedValue(subRow: string, name: string) {
    if (name == Constants.ADMIN_ORDER_STATUS_DROPDOWN) {
      this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] = subRow

    }
    else if (name == Constants.ADMIN_FOOD_STATUS_DROPDOWN) {
      this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] = subRow

    }
    else if (name == Constants.ADMIN_FOOD_PREPARATION_DROPDOWN) {
      this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] = subRow

    }

  }

  toggleRightSideBar(state: boolean) {

    this.showRightSideBar = state

    if (this.showRightSideBar)
      document.body.classList.add("no-parent-scroll");
    else
      document.body.classList.remove("no-parent-scroll");
  }

  getStepStatus(order: any) {

    let stepStatus = { payment: false, food: false, delivered: false }

    if (order?.status == 'success') {
      stepStatus.payment = true
    }
    
    if (order?.foodStatus == 'ready' || order?.foodStatus ==  'served') {
      stepStatus.food = true
    }

    if (order?.foodStatus == 'served') {
      stepStatus.delivered = true
    }

    return stepStatus

  }


 
}




