import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { PaymentService } from 'src/app/payment/payment.service';
import * as moment from 'moment';
import { AdminService } from '../../admin.service';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public loading: boolean = false
  public dishQuantity!: any
  public cartItems!: any
  public total: number = 0
  private mobileRegrex = /^[0-9]{10}$/
  public tables: any[] = []
  public taxes: any[] = []
  public subTotal: number = 0
  public showSearchDishDialog: boolean = false


  public userFormGroup: FormGroup = this.formBuilder.group({
    modeOfPayment: ['notConfirm', [Validators.required]],
    modeOfPaymentInfo: this.formBuilder.array([]),
    mobile: ['', [Validators.required, Validators.pattern(this.mobileRegrex)]],
    fullName: ['', [Validators.required]],
    table: ['', [Validators.required]],
    userId: ['', []]
  });

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _location: Location,
    private mainService: MainService,
    private paymentService: PaymentService,
    private restaurantService: RestaurantService,
    private _snackBar: MatSnackBar,
  ) {
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)

    if (this.checkCartItems()) this.calculateTotal()

  }

  ngOnInit(): void {
    this.getAllTables()
  }

  getAllTables() {
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {
      this.adminService.getAllTables(restaurantSlug)
        .then((res) => {

          this.tables = res.data?.tables
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log("Error", err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })

    }
  }


  confirmOrder() {

    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {

      const orderInfo = this.paymentService.getOrderInfo(restaurantSlug)
      orderInfo.user = this.userFormGroup.value.userId

      orderInfo.userInfo = {
        fullName: this.userFormGroup.value.fullName,
        number: this.userFormGroup.value.mobile,
        email: `${this.userFormGroup.value.mobile}@gmail.com` //this.userFormGroup.value.email
      }

      orderInfo.mCreatedBy = this.mainService.getToLocalStorage(Constants.LOCAL_USER).id
      orderInfo.createdAt = moment().toISOString()
      orderInfo.table = this.userFormGroup.value.table
      orderInfo.modeOfTransaction = "offline"
      let modeOfPayment = this.userFormGroup.value?.modeOfPayment
      let modeOfPaymentInfo = this.userFormGroup.value?.modeOfPaymentInfo[0]

      if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo && (modeOfPaymentInfo?.cash + modeOfPaymentInfo?.online) != this.total) {
        this.mainService.openDialog("Error", "Cash and online amount is not equal to total amount.", "E")
        return
      }

      if (modeOfPayment && modeOfPayment == 'both' && modeOfPaymentInfo) {
        orderInfo.cash = modeOfPaymentInfo?.cash
        orderInfo.online = modeOfPaymentInfo?.online

      } else if (modeOfPayment && modeOfPayment == 'cash') {
        orderInfo.cash = this.total
        orderInfo.online = 0
      
      } else if (modeOfPayment && modeOfPayment == 'online') {
        orderInfo.cash = 0
        orderInfo.online = this.total
      
      }

      orderInfo.modeOfPayment = modeOfPayment


      this.loading = true

      this.adminService.createOrder(orderInfo, restaurantSlug).then((result) => {
        localStorage.setItem(Constants.LOCAL_CART, "")
        this.loading = false
        this.userFormGroup.reset()
        this.refreshCartItems(0)
        this.mainService.openDialog("Success", "Order Created Successfully with Order id: " + result.data.orderId, "S")

      }).catch((err) => {

        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

      })
    }

  }

  searchUser() {
    if (!this.userFormGroup.value.mobile) return
    this.loading = true
    const restaurantSlug = this.restaurantService.getRestaurantSlug()
    if (restaurantSlug) {

      this.adminService.searchUser(this.userFormGroup.value.mobile, restaurantSlug)
        .then((result) => {
          this.loading = false
          const data = result.data
          this.userFormGroup.patchValue({ fullName: data.fullName, mobile: data.number, userId: data.id, table: this.userFormGroup?.value?.table });
        }).catch((err) => {
          this.loading = false
          console.log(err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

        })
    }
  }


  toggleSearchDishDialog() {

    this.showSearchDishDialog = !this.showSearchDishDialog
    if (this.showSearchDishDialog)
      document.body.classList.add("no-parent-scroll");
    else
      document.body.classList.remove("no-parent-scroll");

  }

  public addDish(data: any) {
    const { dish, category } = data
    this.restaurantService.changeDishQunatityLocaly(dish, category.name, 1, category.price, category.id)
    this.refreshCartItems(0)
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


  removeFormControlmodeOfPayment(i = 0) {
    let paymentInfo = this.userFormGroup.controls['modeOfPaymentInfo'] as FormArray;
    paymentInfo.removeAt(i);
  }

  onmodeOfPaymentChange(mop: string) {
    let paymentInfo = this.userFormGroup.controls['modeOfPaymentInfo'] as FormArray;
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
    return (this.userFormGroup.get(formGroupName) as FormArray)
  }

  public getFormError(index: number, errorName: string, key: string, type: string): boolean {
    let _array = this.getFormArray(type);
    return _array.controls[index].get(key)?.errors?.[errorName] || false
  }

  // Add dish category to formGroup

  get modeOfPaymentInfo(): FormArray {
    return this.userFormGroup.get("modeOfPaymentInfo") as FormArray
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
    return <FormArray>this.userFormGroup.get(groupName);
  }


  goBackback() {
    this._location.back(); // <-- go back to previous location on cancel
  }

  getJsonData(data: any): any {
    return data
  }

  refreshCartItems(id: number) {
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)
    this.calculateTotal()
  }

  public getImageUrl(image: any) {
    return this.mainService.getImageUrl(image, Constants.IMAGE_JSON_STRUCTURE_WITHOUT_ATTRIBUTE)
  }

  calculateTotal() {
    this.subTotal = this.restaurantService.calculateTotal(this.cartItems);
    const totalWithTax = this.mainService.calculateTaxes(this.subTotal, this.restaurantService.getTaxes())
    this.total = totalWithTax?.total
    this.taxes = totalWithTax?.taxes
  }

  checkCartItems(): boolean {
    return this.cartItems && Object.values(this.cartItems)?.length > 0 ? true : false
  }

  getCurrency(): string | undefined {
    return this.restaurantService.getCurrency()
  }

}
