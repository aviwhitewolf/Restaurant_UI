import { Component } from '@angular/core';
import { Constants } from './Constants/Interface/Constants';
import { MainService } from './main.service';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {



  constructor(
    private mainService: MainService,
    private userService: UserService
  ) {
    //set country and currency
    const user = this.mainService.getToLocalStorage(Constants.LOCAL_USER)
    if (!user) {
      this.mainService.setToLocalStorage({ country: "IND", currency: "INR", countryCode: "+91", currencySymbol: "₹", jwt: "", privacyPolicyConsent: false }, Constants.LOCAL_USER)
    } else if (user.jwt) {

      this.userService.checkLoggedIn(user.jwt)
        .then((res) => {
        }).catch((error) => {

          //Unauthorized, or token expires
          if (error?.response?.status == 401) {
            user.jwt = ""
            this.mainService.setToLocalStorage(user, Constants.LOCAL_USER)
            this.mainService.openDialog("You've been logged out", "You've been logged out of the website. Just login again, go to home screen and click on Login / Signup button on top  left.", "W", false, true)
          }

          console.error("Invalid token", error)
        })

    }




  }

 



}
