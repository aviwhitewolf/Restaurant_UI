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
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';

interface IUpdateOrder {
  status: string;
  foodStatus: string;
  preparationTime: string;
  mUpdatedBy: any[];
  modeOfTransaction: string;
  cash: number;
  online: number;
  modeOfPayment: string;
  discount?: number;
  orderItems?: any[];
}

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
  public showSearchDishDialog: boolean = false
  public updatedDishesWithOrderItem: any
  public discount: number = 0
  public editOrder: boolean = false;

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
    private _snackBar: MatSnackBar,
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
        this.updatedDishesWithOrderItem = JSON.parse(JSON.stringify(this.order?.orderItems)) as any[]
        this.total = this.order?.totalAmount || 0
        this.discount = this.order?.discount || 0


        const timeDiff = new Date().getTime() - new Date(this.order.createdAt).getTime();

        // Calculate the number of milliseconds in a day
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

        // Check if the time difference is greater than one day
        if (timeDiff <= oneDayInMilliseconds) {
          this.editOrder = true
        }

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

    if (this.discount < 0) {
      this.mainService.openDialog("Error", "Discount should be positive.", "E")
      return
    }

    const updateOrder: IUpdateOrder = {
      status: this.dropDownSelectedValue[Constants.ADMIN_ORDER_STATUS_DROPDOWN] || this.order.status,
      foodStatus: this.dropDownSelectedValue[Constants.ADMIN_FOOD_STATUS_DROPDOWN] || this.order.foodStatus,
      preparationTime: this.dropDownSelectedValue[Constants.ADMIN_FOOD_PREPARATION_DROPDOWN] || this.order.preparationTime,
      mUpdatedBy: [this.mainService.getToLocalStorage(Constants.LOCAL_USER).id],
      modeOfTransaction: "offline",
      cash: 0,
      online: 0,
      modeOfPayment: "notConfirm",
      discount: this.discount
    }

    if (JSON.stringify(this.order?.orderItems) !== JSON.stringify(this.updatedDishesWithOrderItem)) {
      updateOrder.orderItems = this.updatedDishesWithOrderItem
    }

    let modeOfPayment = this.orderFormGroup.value?.modeOfPayment
    let modeOfPaymentInfo = this.orderFormGroup.value?.modeOfPaymentInfo[0]

    if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo && (modeOfPaymentInfo?.cash + modeOfPaymentInfo?.online) != this.calculateTotal()) {
      this.mainService.openDialog("Error", "Cash and online amount is not equal to total amount.", "E")
      return
    }

    if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo) {
      updateOrder.cash = modeOfPaymentInfo?.cash
      updateOrder.online = modeOfPaymentInfo?.online

    } else if (modeOfPayment && modeOfPayment == 'cash') {
      updateOrder.cash = this.calculateTotal()
      updateOrder.online = 0

    } else if (modeOfPayment && modeOfPayment == 'online') {
      updateOrder.cash = 0
      updateOrder.online = this.calculateTotal()

    } else {
      if (updateOrder.status == 'success') {
        this.mainService.openDialog("Error", "Need to select 'Mode of payment'.", "E")
        return
      }
    }

    updateOrder.modeOfPayment = modeOfPayment


    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    this.adminService.updateOrder(orderId, updateOrder, restaurantSlug)
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


  toggleSearchDishDialog() {

    this.showSearchDishDialog = !this.showSearchDishDialog
    if (this.showSearchDishDialog)
      document.body.classList.add("no-parent-scroll");
    else
      document.body.classList.remove("no-parent-scroll");

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


  addDish(data: any) {
    const { dish, category } = data
    const dishIndex = this.updatedDishesWithOrderItem.findIndex((item: any) => item?.dish?.id == dish.id)
    if (dishIndex >= 0) {
      const dishCategory = this.updatedDishesWithOrderItem[dishIndex]?.orderDishCategory
      const categoryIndex = dishCategory.findIndex((item: any) => item.name == category.name)
      if (categoryIndex >= 0) {
        this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity++
        this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].totalPrice =
          this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity * category.price
      } else
        this.updatedDishesWithOrderItem[dishIndex].orderDishCategory.push({ ...category, quantity: 1, unitPrice: category.price, totalPrice: category.price })
    } else {

      this.updatedDishesWithOrderItem.push({ dish: { ...dish }, orderDishCategory: [{ ...category, quantity: 1, unitPrice: category.price, totalPrice: category.price }] })

    }


    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: 'Dish Added',
        type: 'S'
      },
      panelClass: 'snack-bar',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1700
    });

  }

  calculateTotal() {
    let total = 0
    this.updatedDishesWithOrderItem?.forEach((item: any) => {
      item?.orderDishCategory?.forEach((category: any) => {
        total += category.totalPrice
      });
    })

    if (this.order?.taxes) {
      total = this.calculateTaxes(total, this.order?.taxes)?.total
    }

    total -= this.discount

    return total
  }

  calculateTaxes(subtotal: number, taxes: any) {
    let total = subtotal
    const compoundTaxes = []
    const calculatedTaxes = []
    const mTotal = subtotal
    for (let index = 0; index < taxes.length; index++) {
      const tax = taxes[index];
      if (!tax?.disable) {
        if (!tax.compound) {
          const taxDue = mTotal * (tax.rate / 100);
          taxes[index].taxDue = taxDue;
          calculatedTaxes.push(tax)
          total += (mTotal * (1 + (tax?.rate / 100))) - mTotal;
        } else {
          compoundTaxes.push(index)
        }
      }
    }

    let cTotal = total
    for (let index = 0; index < compoundTaxes.length; index++) {
      const i = compoundTaxes[index];
      const compoundTax = taxes[i]
      const taxDue = cTotal * (compoundTax.rate / 100);
      taxes[i].taxDue = taxDue;
      calculatedTaxes.push(compoundTax)
      cTotal += (cTotal * (1 + (compoundTax?.rate / 100))) - cTotal;
    }

    total = cTotal

    return { total, taxes: calculatedTaxes }
  }


  incrementDishCount(dishIndex: number, categoryIndex: number) {
    this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity++

    this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].totalPrice =
      this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity *
      this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].unitPrice
  }


  decrementDishCount(dishIndex: number, categoryIndex: number) {
    if (this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity > 1) {
      this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity--
      this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].totalPrice =
        this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].quantity *
        this.updatedDishesWithOrderItem[dishIndex].orderDishCategory[categoryIndex].unitPrice
    }
  }

  removeDishWithCategory(dishIndex: number, categoryIndex: number) {
    this.updatedDishesWithOrderItem[dishIndex].orderDishCategory.splice(categoryIndex, 1)
    if (this.updatedDishesWithOrderItem[dishIndex]?.orderDishCategory.length == 0) {
      this.updatedDishesWithOrderItem.splice(dishIndex, 1)
    }
    console.log(this.updatedDishesWithOrderItem)
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




