import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { PaymentService } from 'src/app/payment/payment.service';
import * as moment from 'moment';
import { AdminService } from '../../admin.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public loading: boolean = false
  public currencySymbol = ""
  public dishQuantity!: any
  public cartItems!: any
  public total: number = 0
  private mobileRegrex = /[0,9]\d{4,17}/
  public tables : any[] = []


  public userFormGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(this.mobileRegrex)]],
    fullName: ['', [Validators.required]],
    tableNumber: ['', [Validators.required]],
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
    private restaurantService: RestaurantService
  ) {
    this.currencySymbol = this.mainService.getToLocalStorage(Constants.LOCAL_USER).currencySymbol || "₹"
    this.cartItems = this.mainService.getToLocalStorage(Constants.LOCAL_CART)

    if (this.checkCartItems()) this.calculateTotal()

  }

  ngOnInit(): void {
    this.getAllTables()
  }

  getAllTables() {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {

      if(param['slug'])
      this.adminService.getAllTables(param['slug'])
      .then((res) => {

        this.tables = res.data?.tables
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

    });
  }


  confirmOrder() {
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {

      if (param && param['slug']) {

        const orderInfo = this.paymentService.getOrderInfo(param['slug'] || "")
        orderInfo.user = this.userFormGroup.value.userId

        orderInfo.userInfo = {
          fullName: this.userFormGroup.value.fullName,
          number: this.userFormGroup.value.mobile,
          email: this.userFormGroup.value.email
        }

        orderInfo.mCreatedBy = this.mainService.getToLocalStorage(Constants.LOCAL_USER).id
        orderInfo.createdAt = moment().toISOString()
        orderInfo.tableNumber = this.userFormGroup.value.tableNumber
        orderInfo.modeOfPayment = "offline"

        this.adminService.createOrder(orderInfo, param['slug']).then((result) => {
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

    });
  }

  searchUser() {
    if (!this.userFormGroup.value.mobile) return
    this.loading = true
    this.route?.parent?.parent?.params.subscribe((param: any) => {

      if (param && param['slug']) {

        this.adminService.searchUser(this.userFormGroup.value.mobile, param['slug'])
          .then((result) => {
            this.loading = false
            const data = result.data
            this.userFormGroup.patchValue({ fullName: data.fullName, email: data.email, mobile: data.number, userId: data.id, tableNumber : this.userFormGroup?.value?.tableNumber });
          }).catch((err) => {
            this.loading = false
            console.log(err)
            this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")

          })
      }

    });
  }

  public addDish(data: any) {
    const { dish, category } = data
    this.restaurantService.changeDishQunatityLocaly(dish, category.name, 1, category.price, category.id)
    this.refreshCartItems(0)
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
    this.total = this.restaurantService.calculateTotal(this.cartItems);
  }

  checkCartItems(): boolean {
    return this.cartItems && Object.values(this.cartItems).length > 0 ? true : false
  }


}
