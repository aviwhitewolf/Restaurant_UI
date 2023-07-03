import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { Location } from '@angular/common';
import { AdminService } from '../../admin.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SocketService } from 'src/app/socket.service';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public dropDown = Constants.ADMIN_DROPDOWN_ORDER_MENU
  public dropDownSelectedValue: any = {}
  public showRightSideBar: boolean = false
  public orders: any
  private page: number = 1
  private pageSize: number = 20
  private total: number = 0

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  public orderFormGroup: FormGroup = this.formBuilder.group({
    modeOfPayment: ['notConfirm', [Validators.required]],
    modeOfPaymentInfo: this.formBuilder.array([])
  });

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private mainService: MainService,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
    private ngZone: NgZone,
    private socket: SocketService,
    private restaurantService: RestaurantService
  ) {
    this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] = ""
    this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] = ""
    this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] = ""

  }

  ngOnInit(): void {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
      this.route?.params.subscribe((param: any) => {
        this.getSingleOrder(restaurantSlug, +param['orderId'])
      })
    }
  }

  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  getSingleOrder(slug: string, orderId: number) {
    this.loading = true
    this.adminService.getSingleOrder(slug, orderId)
      .then((res: any) => {
        this.order = res.data.results[0]
        this.total = this.order?.totalAmount || 0
        this.emitOrderRead(this.order, slug)

        if (this.order) {
          this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] = this.order.status
          this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] = this.order.foodStatus
          this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] = this.order.preparationTime

          this.orderFormGroup.patchValue({
            modeOfPayment: this.order.modeOfPayment
          })


          if (this.order.modeOfPayment == 'both')
            this.modeOfPaymentInfo.push(this.formBuilder.group({ cash: this.order.cash, online: this.order.online }))

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

    const updateOrder = {
      status: this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] || this.order.status,
      foodStatus: this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] || this.order.foodStatus,
      preparationTime: this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] || this.order.preparationTime,
      mUpdatedBy: [this.mainService.getToLocalStorage(Constants.LOCAL_USER).id],
      modeOfTransaction: "offline",
      cash: 0,
      online: 0,
      modeOfPayment: "notConfirm"
    }

    let modeOfPayment = this.orderFormGroup.value?.modeOfPayment
    let modeOfPaymentInfo = this.orderFormGroup.value?.modeOfPaymentInfo[0]

    if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo && (modeOfPaymentInfo?.cash + modeOfPaymentInfo?.online) != this.total) {
      this.mainService.openDialog("Error", "Cash and online amount is not equal to total amount.", "E")
      return
    }

    if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo) {
      updateOrder.cash = modeOfPaymentInfo?.cash
      updateOrder.online = modeOfPaymentInfo?.online

    } else if (modeOfPayment && modeOfPayment == 'cash') {
      updateOrder.cash = this.total
      updateOrder.online = 0

    } else if (modeOfPayment && modeOfPayment == 'online') {
      updateOrder.cash = 0
      updateOrder.online = this.total

    }else {
      this.mainService.openDialog("Error", "Need to select 'Mode of payment'.", "E")

    }

    updateOrder.modeOfPayment = modeOfPayment


    this.loading = true
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


  private emitOrderRead(order: any, restaurantSlug: string) {

    this.socket.emit(Constants.SOCKET_ORDER_READ, order, restaurantSlug, (data: any) => {

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

    this.showRightSideBar = !this.showRightSideBar

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

    if (order?.foodStatus == 'ready' || order?.foodStatus == 'served') {
      stepStatus.food = true
    }

    if (order?.foodStatus == 'served') {
      stepStatus.delivered = true
    }

    return stepStatus

  }



  removeFormControlmodeOfPayment(i = 0) {
    let paymentInfo = this.orderFormGroup.controls['modeOfPaymentInfo'] as FormArray;
    paymentInfo.removeAt(i);
  }

  onmodeOfPaymentChange(mop: string) {
    let paymentInfo = this.orderFormGroup.controls['modeOfPaymentInfo'] as FormArray;
    if (mop == "both" && paymentInfo.length == 0) {
      this.addPaymentInfoObject()
    } else {
      this.removeFormControlmodeOfPayment(0)
    }

  }

  checkForFormErrors(index: number, key: string, type: string): boolean {
    let array = this.getFormArray(type);
    if (array.controls[index].get(key)?.errors && (array.controls[index].get(key)?.touched || array.controls[index].get(key)?.dirty))
      return true
    else
      return false
  }

  public getFormArray(formGroupName: string): FormArray {
    return (this.orderFormGroup.get(formGroupName) as FormArray)
  }

  public getFormError(index: number, errorName: string, key: string, type: string): boolean {
    let _array = this.getFormArray(type);
    return _array.controls[index].get(key)?.errors?.[errorName] || false
  }

  // Add dish category to formGroup

  get modeOfPaymentInfo(): FormArray {
    return this.orderFormGroup.get("modeOfPaymentInfo") as FormArray
  }

  private addPaymentInfoToFormArray(): FormGroup {
    return this.formBuilder.group({
      cash: ['', [Validators.required]],
      online: ['', [Validators.required]]
    });
  }

  public addPaymentInfoObject(): void {
    this.modeOfPaymentInfo.push(
      this.addPaymentInfoToFormArray()
    );
  }


  getFormControl(groupName: string): FormArray {
    return <FormArray>this.orderFormGroup.get(groupName);
  }




}




