import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/Constants/Interface/Constants';
import axios from 'axios';
import { MainService } from 'src/app/main.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/reusable/snackbar/snackbar.component';
import { RestaurantService } from 'src/app/restaurant/restaurant.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private timer: any
  public wait: boolean = false
  public timeLeft: number = Constants.OTP_TIMER;
  private mobileRegrex = /^[5-9]\d{9}$/
  public otpScreen: boolean = false
  public loginScreen: boolean = true
  private number: number = 0
  private email: string = ""
  public loading: boolean = false
  public loginFormGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(this.mobileRegrex)]]
  });

  public loginFormOtpGroup: FormGroup = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.maxLength(6)]]
  })

  constructor(
    private formBuilder: FormBuilder,
    private mainService: MainService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
  }

  resendOtp() {
    if (!this.wait)
      this.sendOtp()
  }

  sendOtp(): void {
    this.loginScreen = true
    this.otpScreen = false
    this.loading = true
    this.loginFormOtpGroup.reset()
    this.loading = true
    const loginData = {
      email: this.loginFormGroup.value.email.toLowerCase(),
      number: this.loginFormGroup.value.mobile
    }

    if (this.restaurantService.getRestaurantSlug())
      axios.post(Constants.BASE_URL + Constants.LOGIN_URL + `/${this.restaurantService.getRestaurantSlug()}`, loginData)
        .then(response => {
          this.wait = true
          this.startTimer()
          this.otpScreen = true
          this.loginScreen = false
          this.number = this.loginFormGroup.value.mobile
          this.email = this.loginFormGroup.value.email
          this._snackBar.openFromComponent(SnackbarComponent, {
            data: {
              message: 'Otp sent successfully',
              type: 'S'

            },
            panelClass: 'snack-bar',
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 1700
          });
          this.loading = false
        }).catch(err => {
          this.loading = false
          console.log("Error", err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })

  }

  onLogin() {
    this.loading = true
    if (this.number != 0) {
      const loginData = {
        number: this.number,
        otp: this.loginFormOtpGroup.value.otp
      }

      axios.post(Constants.BASE_URL + Constants.VERIFY_USER_URL, loginData)
        .then((response: any) => {
          if (this.timer) clearInterval(this.timer);
          this.loginScreen = false
          this.otpScreen = false
          const jwt = response.data.jwt
          const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
          user.number = this.number
          user.email = this.email
          user.username = response.data.user.username
          user.countryCode = response.data.user.countryCode
          user.country = response.data.user.country
          user.confirmed = response.data.user.confirmed
          user.blocked = response.data.user.blocked
          user.fullName = response.data.user.fullName || ""
          user.jwt = jwt
          user.id = response.data.user.id
          this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
          this.loginFormOtpGroup.reset()
          window.location.reload();
          this.loading = false
        }).catch(err => {
          this.loading = false
          console.log("Error", err)
          this.mainService.openDialog("Error", this.mainService.errorMessage(err), "E")
        })
    }

  }

  getErrors(whichForm: string): string {

    let errorText = ""
    if (whichForm == 'loginFormGroup')
      if ((this.loginFormGroup.get('email')?.errors &&
        (this.loginFormGroup.get('email')?.touched || this.loginFormGroup.get('email')?.dirty))
        ||
        (this.loginFormGroup.get('mobile')?.errors &&
          (this.loginFormGroup.get('mobile')?.touched || this.loginFormGroup.get('mobile')?.dirty))
      ) {

        if (this.loginFormGroup.get('mobile')?.errors?.['required']) {
          errorText += "Mobile is required"
        }

        if (this.loginFormGroup.get('email')?.errors?.['required']) {
          if (errorText?.length > 0) errorText += " & "
          errorText += "Email is required"
        }

        if (this.loginFormGroup.get('email')?.errors?.['email']) {
          if (errorText?.length > 0) errorText += " & "
          errorText += "Email is invalid"
        }

        if (this.loginFormGroup.get('mobile')?.errors?.['pattern']) {
          if (errorText?.length > 0) errorText += " & "
          errorText += "Mobile is invalid"
        }

      }

    if (whichForm == 'loginFormOtpGroup') {

      if (this.loginFormOtpGroup.get('otp')?.errors &&
        (this.loginFormOtpGroup.get('otp')?.touched || this.loginFormOtpGroup.get('otp')?.dirty)) {

        if (this.loginFormOtpGroup.get('otp')?.errors?.['required']) {
          errorText += "Otp is required"
        }

        if (this.loginFormOtpGroup.get('otp')?.errors?.['maxLength']) {
          if (errorText?.length > 0) errorText += " & "
          errorText += "Otp length should be 6"
        }

      }


    }
    return errorText

  }


  startTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.wait = false
        this.timeLeft = Constants.OTP_TIMER;
        clearInterval(this.timer);
      }
    }, 1000)
  }
  getCountryAndCode() {
    const restaurant = this.restaurantService.getRestaurantData()
    return restaurant?.country + " " + restaurant?.countryCode
  }

  getCountryCode() {
    const restaurant = this.restaurantService.getRestaurantData()
    return restaurant?.countryCode
  }



}
