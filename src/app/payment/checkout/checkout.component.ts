import { Component, NgZone, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { PaymentService } from '../payment.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public isLogin: boolean = false
  public isLoading: boolean = true
  private jwt: string = ""
  private slug: string = ""
  public tables: any[] = []

  public tableFormGroup: FormGroup = this.formBuilder.group({
    table: ['', [Validators.required, Validators.nullValidator]],
    note : ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private mainService: MainService,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private restaurantService: RestaurantService,
    private _location: Location
  ) {
    this.slug = restaurantService.getRestaurantSlug()
    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    this.jwt = user.jwt || ""
    if (!this.mainService.getToLocalStorage(Constants.LOCAL_CART)) {

    }
  }

  async ngOnInit(): Promise<void> {

    if (this.jwt) {
      this.userService.checkLoggedIn(this.jwt).then(response => {
        this.isLoading = false
        this.isLogin = true
      }).catch((err: any) => {
        this.mainService.openDialog("Login Error", err && err?.response && err?.response && err?.response?.data?.error ? (err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message) : "Something went wrong, check your network and try again.", "E")
        console.log("User Login Error", err)
      })

    } else {
      this.isLoading = false
    }

    this.route.queryParams.subscribe(params => {
      this.getAllTables(params['tb'])
    });

  }

  private loadScript(src: string) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }


  public createOrder(modeOfTransaction: string) {

    if (this.restaurantService.getRestaurantPaymentGateway() == 'razorpay') {
      this.createOrderWithRazorpay(modeOfTransaction)
    } else {
      this.mainService.openDialog("Payment Service Error", 'No Payment gateway selected?', "E")
    }
  }


  // Razorpay 
  public async createOrderWithRazorpay(modeOfTransaction: string) {

    if (modeOfTransaction == 'online') {
      this.isLoading = true
      const res = await this.loadScript(Constants.RAZORPAY_SCRIPT_URL)
      if (!res) {
        this.isLoading = false
        console.error('Razorpay SDK failed to load. Are you online?')
        this.mainService.openDialog("Payment Service Error", 'Payment service failed to load. Are you online?', "E")
        return
      }


      if (this.slug) {
        this.paymentService.createOrder(this.paymentService.getOrderInfo(this.slug), this.tableFormGroup.value.table, this.tableFormGroup.value.note, modeOfTransaction).then((response) =>
          this.launchRazorPay(response.data))
          .catch((err) => {
            this.isLoading = false
            console.log("Error while creating order", err)
            this.mainService.openDialog("Create Order Error", err && err?.response && err?.response && err?.response?.data?.error ? (err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message) : "Something went wrong, check your network and try again.", "E")
          })
      }


    } else if (modeOfTransaction == 'offline') {
      this.isLoading = true

      if (this.slug) {
        this.paymentService.createOrder(this.paymentService.getOrderInfo(this.slug), this.tableFormGroup.value.table, this.tableFormGroup.value.note, modeOfTransaction)
          .then((response: any) => {
            this.isLoading = false
            this.mainService.setshowPaymentStatus(true)
            localStorage.setItem(Constants.LOCAL_CART, "")
            this.zone.run(() => this.router.navigate(['/restaurant', this.slug, 'payment', Constants.SUCCESS], { queryParams: { tb: this.tableFormGroup.value.table, message: "Order placed, preparing your order, kindly make your payment on reception." } }));
          })
          .catch((err) => {
            this.isLoading = false
            console.log("Error while creating order", err)
            this.mainService.openDialog("Create Order Error", err && err?.response && err?.response && err?.response?.data?.error ? (err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message) : "Something went wrong, check your network and try again.", "E")
          })
      }

    }
  }

  private launchRazorPay(data: any) {
    this.mainService.setshowPaymentStatus(true)
    const razorpayInfo = data.paymentInfo
    const options = {
      key: razorpayInfo.razorpayKeyId,
      currency: data.currency,
      amount: razorpayInfo.amountBaseUnit,
      order_id: razorpayInfo.razorpayOrderId,
      notes: { id: data.id },
      name: "Paying to " + this.slug.split('-').join(' ').toUpperCase(),
      description: Constants.PAYMENT_DESCRIPTION,
      image: '../../../favicon.ico',
      handler: (response: any) => this.zone.run(() => {

        if (response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
          try {
            // console.log("Payment_id", response.razorpay_payment_id,
            //   "Order Id", response.razorpay_order_id, "Signature", response.razorpay_signature)

            localStorage.setItem(Constants.LOCAL_CART, "")
            this.router.navigate(['/restaurant', this.slug, 'payment', Constants.SUCCESS], { queryParams: { tb: this.tableFormGroup.value.table, message: "Payment Received, preparing your order. Have a great day." } })

          } catch (err: any) {
            this.isLoading = false
            console.log(err)
            this.mainService.openDialog("Some Error Occured", (err.message) || "Something went wrong, try again later", "E")
          }

        }

      }),
      prefill: {
        name: this.mainService.getToLocalStorage(Constants.LOCAL_USER).fullName,
        email: this.mainService.getToLocalStorage(Constants.LOCAL_USER).email,
        contact: this.mainService.getToLocalStorage(Constants.LOCAL_USER).number
      },
      theme: {
        color: "#3f51b5"
      },
      /**
      * You can track the modal lifecycle by * adding the below code in your options
      */
      "modal": {
        "ondismiss": () => this.zone.run(() => {
          this.isLoading = false
          this._location.back();
        })
      }
    }



    const mWindow = window as any
    const paymentObject = new mWindow.Razorpay(options)
    paymentObject.on('payment.failed', (response: any) => this.zone.run(() => {
      // console.log(
      //   "Code", response.error.code,
      //   "Description", response.error.description,
      //   "source", response.error.source,
      //   "Step", response.error.step,
      //   "Reason", response.error.reason,
      //   "Order_id", response.error.metadata.order_id,
      //   "Payment_id", response.error.metadata.payment_id
      // );
      try {
        this.router.navigate(['/restaurant', this.slug, 'payment', Constants.FAILED], { queryParams: { tb: this.tableFormGroup.value.table } })
      } catch (err: any) {
        this.isLoading = false
        console.log(err)
        this.mainService.openDialog("Some Error Occured", (err.message) || "Something went wrong, try again later", "E")
      }

    }));
    paymentObject.open()

  }

  // Razorpay End

  getAllTables(mtable: string) {
    const slug = this.restaurantService.getRestaurantSlug()
    if (slug) {
      this.isLoading = true
      this.paymentService.getAllTables(slug)
        .then((res) => {
          this.tables = res.data
          const tableId = this.tables?.filter(table => table.slug == mtable)[0]?.id
          this.tableFormGroup.controls['table'].patchValue(tableId)
          this.isLoading = false
        }).catch((err) => {
          this.isLoading = false
          console.log("Error", err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })
    }

  }

  public checkTableError() {
    return this.tableFormGroup.get('table')?.errors

  }

}

