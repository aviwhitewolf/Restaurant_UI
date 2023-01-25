import { Component, NgZone, OnInit } from '@angular/core';
import { Constants } from 'src/app/Constants/Interface/Constants';
import { MainService } from 'src/app/main.service';
import { PaymentService } from '../payment.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMsgComponent } from 'src/app/reusable/error-msg/error-msg.component';
import { UserService } from 'src/app/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';

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
    tableNumber: ['', [Validators.required, Validators.nullValidator]]
  });


  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private mainService: MainService,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {
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

    this.route?.parent?.params.subscribe((param: any) => {
      if (param && param['name']) {
        this.slug = param['name']
        this.route.queryParams.subscribe(params => {

          // this.tableFormGroup.controls['tableNumber'].setValue(params['tb'])
          this.getAllTables(param['name'], params['tb'])
        });
      }
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

  public async createOrderAndRazorpay(modeOfPayment: string) {

    if (modeOfPayment == 'online') {
      this.isLoading = true
      const res = await this.loadScript(Constants.RAZORPAY_SCRIPT_URL)
      if (!res) {
        this.isLoading = false
        console.error('Razorpay SDK failed to load. Are you online?')
        this.mainService.openDialog("Payment Service Error", 'Payment service failed to load. Are you online?', "E")
        return
      }

      this.route?.parent?.params.subscribe((param: any) => {
        if (param && param['name']) {
          this.paymentService.createOrder(this.paymentService.getOrderInfo(param['name'] || ""), this.tableFormGroup.value.tableNumber, modeOfPayment).then((response) =>
            this.launchRazorPay(response.data))
            .catch((err) => {
              this.isLoading = false
              console.log("Error while creating order", err)
              this.mainService.openDialog("Create Order Error", err && err?.response && err?.response && err?.response?.data?.error ? (err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message) : "Something went wrong, check your network and try again.", "E")
            })
        }
      });

    } else if (modeOfPayment == 'offline') {
      this.isLoading = true
      this.route?.parent?.params.subscribe((param: any) => {
        if (param && param['name']) {
          this.paymentService.createOrder(this.paymentService.getOrderInfo(param['name'] || ""), this.tableFormGroup.value.tableNumber, modeOfPayment)
            .then((response: any) => {
              this.isLoading = false
              this.mainService.setshowPaymentStatus(true)
              localStorage.setItem(Constants.LOCAL_CART, "")
              this.zone.run(() => this.router.navigate(['payment', this.slug, Constants.SUCCESS], { queryParams: { tb: this.tableFormGroup.value.tableNumber, message: "Order placed, preparing your order, kindly make your payment on desk" } }));
            })
            .catch((err) => {
              this.isLoading = false
              console.log("Error while creating order", err)
              this.mainService.openDialog("Create Order Error", err && err?.response && err?.response && err?.response?.data?.error ? (err?.response?.data?.error?.status + ": " + err?.response?.data?.error?.message) : "Something went wrong, check your network and try again.", "E")
            })
        }
      });
    }
  }

  private launchRazorPay(data: any) {
    this.mainService.setshowPaymentStatus(true)
    const options = {
      key: data.razorpayKeyId,
      currency: data.currency,
      amount: data.amountBaseUnit,
      order_id: data.razorpayOrderId,
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
            this.router.navigate(['payment', this.slug, Constants.SUCCESS], { queryParams: { tb: this.tableFormGroup.value.tableNumber, message: "Payment Received, preparing your order" } })

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
        this.router.navigate(['payment', this.slug, Constants.FAILED], { queryParams: { tb: this.tableFormGroup.value.tableNumber } })
      } catch (err: any) {
        this.isLoading = false
        console.log(err)
        this.mainService.openDialog("Some Error Occured", (err.message) || "Something went wrong, try again later", "E")
      }

    }));
    paymentObject.open()

  }

  getAllTables(slug: string, tableNumber: string) {
    this.isLoading = true

    this.paymentService.getAllTables(slug)
      .then((res) => {
        this.tables = res.data

        const tableName = this.tables?.filter(table => table.slug == tableNumber)[0]?.name
        this.tableFormGroup.controls['tableNumber'].patchValue(tableName)
        this.isLoading = false
      }).catch((err) => {
        this.isLoading = false
        console.log("Error", err)
        this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
      })

  }

  public checkTableError() {
    return this.tableFormGroup.get('tableNumber')?.errors

  }

  private openDialog(heading: string, error: string, type: string) {
    this.dialog.open(ErrorMsgComponent, {
      data: {
        message: error,
        type: type,
        heading: heading
      },
      panelClass: 'popUp-modalbox'
    });
    this.isLoading = false
  }

}

